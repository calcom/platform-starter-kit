"use server";

import { type LoginFormState } from "./login/_components/login";
import { LoginSchema, SignupSchema, auth, signIn, unstable_update, FiltersSchema } from "@/auth";
import { type User } from "@prisma/client";
import { type Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { db } from "prisma/client";
import { z } from "zod";

export async function signInWithCredentials(_prevState: LoginFormState, formData: FormData) {
  try {
    const credentials = LoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!credentials.success) {
      return {
        inputErrors: credentials.error.flatten().fieldErrors,
      };
    }

    await signIn("credentials", formData);
    return { error: null };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          console.error("Uncaught error signing in (AuthError): ", error);
          return { error: "Something went wrong." };
      }
    }
    console.error("Uncaught error signing in", error);
    throw error;
  }
}

export async function addUserFilters(_prevState: { error?: string | null }, formData: FormData) {
  try {
    const sesh = await auth();

    if (!sesh?.user?.id) return { error: "User not logged in " };

    const filters = FiltersSchema.safeParse({
      categories: formData.get("categories"),
      capabilities: formData.get("capabilities"),
      frameworks: formData.get("frameworks"),
      budgets: formData.get("budgets"),
      languages: formData.get("languages"),
      regions: formData.get("regions"),
    });

    if (!filters.success) {
      return {
        inputErrors: filters.error.flatten().fieldErrors,
      };
    }

    const selectedFilterOptions = [
      { filterOpdtionFieldIds: filters.data.budgets, filterCategoryFieldId: "budgets" },
      { filterOpdtionFieldIds: filters.data.capabilities, filterCategoryFieldId: "capabilities" },
      { filterOpdtionFieldIds: filters.data.categories, filterCategoryFieldId: "categories" },
      { filterOpdtionFieldIds: filters.data.frameworks, filterCategoryFieldId: "frameworks" },
      { filterOpdtionFieldIds: filters.data.languages, filterCategoryFieldId: "languages" },
    ]
      .map(({ filterOpdtionFieldIds, filterCategoryFieldId }) => {
        return filterOpdtionFieldIds.map((fieldId) => {
          return {
            filterCategoryFieldId,
            filterOptionFieldId: fieldId,
            userId: sesh?.user.id,
          };
        });
      })
      // to filter out any null values:
      .filter(Boolean) as Prisma.FilterOptionsOnUserCreateManyInput[][];

    const data = selectedFilterOptions.flat();

    const createOrUpdateFilterPromises: Array<Promise<any>> = [];

    for (const filter of data) {
      createOrUpdateFilterPromises.push(
        db.filterOptionsOnUser.upsert({
          where: {
            userId_filterOptionFieldId_filterCategoryFieldId: {
              userId: filter.userId,
              filterOptionFieldId: filter.filterOptionFieldId,
              filterCategoryFieldId: filter.filterCategoryFieldId,
            },
          },
          update: filter,
          create: filter,
        })
      );
    }

    await Promise.all(createOrUpdateFilterPromises);

    return { success: true };
  } catch (err) {
    throw err;
  }
}

export async function signUpWithCredentials(_prevState: { error?: string | null }, formData: FormData) {
  try {
    const credentials = SignupSchema.safeParse({
      name: formData.get("name"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!credentials.success) {
      return {
        inputErrors: credentials.error.flatten().fieldErrors,
      };
    }

    await signIn("credentials", formData);
    return { error: null };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          console.error("Uncaught error signing in (AuthError): ", error);
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
  if (!sesh?.user.id) {
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
  if (!key) {
    console.error("[_actions] Invalid form data", formData);
    return { error: "Invalid form data" };
  }
  let user: User | null;
  try {
    user = await db.user.update({
      where: { id: sesh.user.id },
      data: {
        // @ts-expect-error - key as "name" | "bio" didn't work -- not sure why
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

  // @ts-expect-error - key as "name" | "bio" didn't work -- not sure why
  return { success: `Successfully updated your ${key} to: '${userEdit.data[key]}'.` };
}
