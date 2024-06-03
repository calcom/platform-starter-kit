import { SignupForm } from "@/app/signup/_components/signup";
import { db } from "prisma/client";

export default async function SignupPage() {
  const filterOptions = await db.filterOption.findMany();
  return (
    <div className="flex items-center justify-center p-10">
      <SignupForm filterOptions={filterOptions} />
    </div>
  );
}
