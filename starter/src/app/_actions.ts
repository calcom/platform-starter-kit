"use server";

import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { db } from "prisma/client";
import { z } from "zod";

export async function signInWithCredentials(_prevState: { error?: string | null }, formData: FormData) {
  try {
    console.log("Signing in with credentials form data: ", formData);
    await signIn("credentials", formData);
  } catch (error) {
    if (isRedirectError(error)) throw error;

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    console.error("Uncaught error signing in", error);
    throw error;
  }
}

export async function expertEdit(
  _prevState: { error: string; data: null } | { data: string; error: null } | { error: null; data: null },
  formData: FormData
) {
  try {
    console.log("[_actions] Updating expert with form data: ", formData);
    const sesh = await auth();
    if (!sesh.user.id) {
      console.log("[_actions] Unauthorized user edit", formData);
      return { error: "Unauthorized.", data: null };
    }
    const formDataWithoutActionFields = Object.fromEntries(
      Array.from(formData.entries()).filter(([key]) => !key.toLowerCase().startsWith("$action"))
    );
    const userEdit = z
      .object({
        name: z.string().min(1).max(255),
      })
      .safeParse(formDataWithoutActionFields);

    if (!userEdit.success) {
      console.log("[_actions] Inavlid form data", formData);
      return { data: null, error: "Invalid form data." };
    }

    const edited = await db.user.update({
      where: { id: sesh.user.id },
      data: {
        name: userEdit.data.name,
      },
    });
    console.info("[_actions] Successfully updated the expert: ", edited.name);
  } catch (error) {
    console.error("Uncaught error updating expert", error);
    throw error;
  }
  revalidatePath("/dashboard/settings/profile");
  redirect("/dashboard/settings/profile");
}
