import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaConnect } from "@/lib/prisma-config";

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }

  const status = request.nextUrl.searchParams.get("status") || "";
  const where: any = {};
  if (status) where.status = status;

  const transactions = await PrismaConnect.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      ListGames: { select: { name: true, prefix: true } },
    },
  });

  const stats = {
    total: await PrismaConnect.transaction.count(),
    success: await PrismaConnect.transaction.count({ where: { status: "SUCCESS" } }),
    pending: await PrismaConnect.transaction.count({ where: { status: "PENDING" } }),
    failed: await PrismaConnect.transaction.count({ where: { status: "FAILED" } }),
  };

  return NextResponse.json({ status: 200, data: transactions, stats });
}
