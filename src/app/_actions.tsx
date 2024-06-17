"use server";

import { auth, signIn, unstable_update } from "@/auth";
import { credentialsSchema } from "@/cal/utils";
import { type User } from "@prisma/client";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { db } from "prisma/client";
import { z } from "zod";

export async function signInWithCredentials(_prevState: { error?: string | null }, formData: FormData) {
  try {
    const credentials = credentialsSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if(!credentials.success){
      return {
        inputErrors: credentials.error.flatten().fieldErrors,
      }
    }

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
  _prevState: { error: null | string } | { success: null | string },
  formData: FormData
) {
  console.log("[_actions] Updating expert with form data: ", formData);
  const sesh = await auth();
  if (!sesh.user.id) {
    console.log("[_actions] Unauthorized user edit", formData);
    return { error: "Unauthorized" };
  }
  const formDataWithoutActionFields = Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => !key.toLowerCase().startsWith("$action"))
  );
  const userEdit = z
    .object({
      name: z.string().min(1).max(255),
    })
    .or(z.object({ bio: z.string().min(1).max(255) }))
    .safeParse(formDataWithoutActionFields);

  if (!userEdit.success) {
    console.log("[_actions] Inavlid form data", formData);
    return { error: "Invalid form data" };
  }

  const key = Object.keys(userEdit.data)[0];
  let user: User | null;
  try {
    user = await db.user.update({
      where: { id: sesh.user.id },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        [key]: userEdit.data[key],
      },
    });
  } catch (error) {
    console.error("Uncaught error updating expert", error);
    return { error: "Internal Server Error" };
  }
  revalidatePath("/dashboard/settings/profile");
  await unstable_update({ user: { name: user.name } });

  return { success: `Successfully updated your ${key} to: '${userEdit.data[key]}'.` };
}
