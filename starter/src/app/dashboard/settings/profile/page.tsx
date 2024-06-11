import ExpertEditForm from "../_components/expert-edit";
import ExpertBooker from "@/app/experts/[expertUsername]/_components/expert-booker";
import { currentUser } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { db } from "prisma/client";

export default async function DashboardSettingsProfile() {
  const user = await currentUser();
  const expert = await db.user.findUnique({
    where: { id: user.id },
    include: { calAccount: true },
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Your Profile Page</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          Make edits to your profile page below.
        </CardDescription>
      </CardHeader>
      <Separator className="my-4" />
      <CardContent>
        <Card className="border-2 border-black">
          <CardHeader className="rounded-t-lg bg-muted p-4">
            {/* red yellow and green dot to display the window frame form macOS: */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="flex flex-1 flex-col items-center gap-4 overflow-auto">
              <div className="flex w-full flex-col justify-between gap-4 rounded-md bg-muted/50 px-8 py-4  sm:px-10 lg:flex-row lg:px-12">
                <div className="flex items-center gap-x-6">
                  <Image
                    alt="Expert image"
                    className="aspect-square rounded-md object-cover"
                    src="https://picsum.photos/200"
                    height="64"
                    width="64"
                  />
                  <div>
                    <ExpertEditForm id="name" name="name" placeholder={expert.name} />
                  </div>
                </div>
              </div>
              <div className="mx-auto mt-4 grid w-full gap-2 px-8 sm:px-10 lg:px-12">
                <h2 className="text-3xl font-semibold">About Us</h2>
              </div>
              <div className="mx-auto mt-4 grid w-full gap-2 px-8 sm:px-10 lg:px-12">
                <ExpertEditForm id="bio" name="bio" placeholder={expert.bio} />
              </div>
              <div className="mx-auto mt-4 grid w-full gap-2 px-8 sm:px-10 lg:px-12">
                <h2 className="text-3xl font-semibold">Availability</h2>
                <CardDescription>
                  If you want to make changes to your Booking page, go to your{" "}
                  <Link href="/dashboard/settings/availability" className="underline">
                    Availability
                  </Link>{" "}
                  settings.
                </CardDescription>
              </div>
              <div className="border-subtle mx-8 mt-12 flex aspect-[2.5/1] flex-col-reverse items-center overflow-x-clip rounded-2xl border bg-muted pb-6 pl-6 pt-6 shadow-sm max-md:pr-6 sm:mx-10 md:grid md:grid-cols-[minmax(440px,1fr)_minmax(0,2.5fr)] lg:mx-12">
                <div className="md:min-w-[96vw] [&_.calcom-atoms]:bg-[transparent]">
                  {Boolean(expert.calAccount) && (
                    <div className="pointer-events-none">
                      <ExpertBooker calAccount={expert.calAccount!} expert={expert} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
