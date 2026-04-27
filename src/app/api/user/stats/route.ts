import { NextResponse } from "next/server";
import { getSession, checkRateLimit } from "@/lib/auth";
import { PrismaConnect } from "@/lib/prisma-config";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized.", status: 401 }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [apiKeysCount, requestsToday, rateLimit] = await Promise.all([
    PrismaConnect.apiKey.count({ where: { userId: user.id } }),
    PrismaConnect.apiLog.count({
      where: { userId: user.id, createdAt: { gte: today } },
    }),
    checkRateLimit(user.id, user.role),
  ]);

  return NextResponse.json({
    status: 200,
    data: {
      apiKeysCount,
      requestsToday,
      rateLimit: { remaining: rateLimit.remaining, limit: rateLimit.limit },
      role: user.role,
      username: user.username,
    },
  });
}
