// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { X_CAL_SECRET_KEY } from "@/app/lib/constants";
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

type Data = {
  email: string;
  username: string;
  id: number;
  accessToken: string;
};

// example endpoint to create a managed cal.com user
export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const existingUser = await prisma.user.findFirst({ orderBy: { createdAt: "desc" } });
  if (existingUser && existingUser.calcomUserId) {
    console.log("found existing user: ", existingUser);
    return NextResponse.json({
      id: existingUser.calcomUserId,
      email: existingUser.email,
      username: existingUser.calcomUsername ?? "",
      accessToken: existingUser.accessToken ?? "",
    });
  }
  const localUser = await prisma.user.create({
    data: {
      email,
    },
  });
  if (!process.env.NEXT_PUBLIC_X_CAL_ID) {
    NextResponse.json({ error: "Missing X_CAL_ID" }, { status: 500 });
  }
  const response = await fetch(
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    `${process.env.NEXT_PUBLIC_CALCOM_API_URL ?? ""}/oauth-clients/${process.env.NEXT_PUBLIC_X_CAL_ID}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        [X_CAL_SECRET_KEY]: process.env.X_CAL_SECRET_KEY ?? "",
        origin: "http://localhost:4321",
      },
      body: JSON.stringify({
        email,
        name: "John Jones",
        timeZone: "Asia/Kolkata",
      }),
    }
  );
  const body = await response.json();
  console.log("body: ", body);
  await prisma.user.update({
    data: {
      refreshToken: (body.data?.refreshToken as string) ?? "",
      accessToken: (body.data?.accessToken as string) ?? "",
      calcomUserId: body.data?.user.id,
      calcomUsername: (body.data?.user.username as string) ?? "",
    },
    where: { id: localUser.id },
  });
  await createDefaultSchedule(body.data?.accessToken as string);
  console.log("console.log(body): ", body);
  return NextResponse.json({
    id: body?.data?.user?.id,
    email: (body.data?.user.email as string) ?? "",
    username: (body.data?.username as string) ?? "",
    accessToken: (body.data?.accessToken as string) ?? "",
  });
}

async function createDefaultSchedule(accessToken: string) {
  const name = "Default Schedule";
  const timeZone = "Europe/London";

  const response = await fetch(
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    `${process.env.NEXT_PUBLIC_CALCOM_API_URL ?? ""}/schedules`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name,
        timeZone,
      }),
    }
  );

  const schedule = await response.json();
  return schedule;
}
