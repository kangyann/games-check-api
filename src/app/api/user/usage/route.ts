import { NextResponse } from "next/server";
import { getSession, checkRateLimit } from "@/lib/auth";
import { PrismaConnect } from "@/lib/prisma-config";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized.", status: 401 }, { status: 401 });
  }

  const rateLimit = await checkRateLimit(user.id, user.role);

  // Get last 7 days usage
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = await PrismaConnect.apiLog.count({
      where: {
        userId: user.id,
        createdAt: { gte: date, lt: nextDate },
      },
    });

    days.push({ date: date.toISOString(), count });
  }

  const total = await PrismaConnect.apiLog.count({
    where: { userId: user.id },
  });

  return NextResponse.json({
    status: 200,
    data: {
      daily: days,
      total,
      limit: rateLimit.limit,
      role: user.role,
    },
  });
}
