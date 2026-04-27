import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaConnect } from "@/lib/prisma-config";

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Forbidden.", status: 403 },
      { status: 403 }
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, totalApiKeys, totalRequestsToday, totalGames, recentUsers, recentLogs] =
    await Promise.all([
      PrismaConnect.user.count(),
      PrismaConnect.apiKey.count(),
      PrismaConnect.apiLog.count({ where: { createdAt: { gte: today } } }),
      PrismaConnect.listGames.count(),
      PrismaConnect.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, username: true, email: true, role: true, createdAt: true },
      }),
      PrismaConnect.apiLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: { id: true, endpoint: true, method: true, status: true, ip: true, createdAt: true },
      }),
    ]);

  return NextResponse.json({
    status: 200,
    data: {
      totalUsers,
      totalApiKeys,
      totalRequestsToday,
      totalGames,
      recentUsers,
      recentLogs,
    },
  });
}
