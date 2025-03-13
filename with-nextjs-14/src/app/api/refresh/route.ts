import { NextRequest, NextResponse } from "next/server";

import prisma from "../../lib/prismaClient";
import { X_CAL_SECRET_KEY } from "@/app/lib/constants";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  const accessToken = authHeader?.split("Bearer ")[1];

  if (accessToken) {
    const localUser = await prisma.user.findUnique({
      where: {
        accessToken: accessToken as string,
      },
    });
    if (localUser?.refreshToken) {
      const response = await fetch(
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        `${process.env.NEXT_PUBLIC_CALCOM_API_URL ?? ""}/oauth/${
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        process.env.NEXT_PUBLIC_X_CAL_ID ?? ""
        }/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            [X_CAL_SECRET_KEY]: process.env.X_CAL_SECRET_KEY ?? "",
          },
          body: JSON.stringify({
            refreshToken: localUser.refreshToken,
          }),
        }
      );
      if (response.status === 200) {
        const resp = await response.json();
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = resp.data;

        await prisma.user.update({
          data: {
            refreshToken: (newRefreshToken as string) ?? "",
            accessToken: (newAccessToken as string) ?? "",
          },
          where: { id: localUser.id },
        });
        return NextResponse.json({ accessToken: newAccessToken });
      }
      return NextResponse.json({ accessToken: "" }, { status: 404 });
    }
  }

  return NextResponse.json({ accessToken: "" }, { status: 404 });

}