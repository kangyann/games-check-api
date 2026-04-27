import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaConnect } from "@/lib/prisma-config";

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }

  const endpoint = request.nextUrl.searchParams.get("endpoint") || "";

  const where: any = {};
  if (endpoint) where.endpoint = { contains: endpoint };

  const logs = await PrismaConnect.apiLog.findMany({
    where,
    take: 100,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      endpoint: true,
      method: true,
      status: true,
      ip: true,
      createdAt: true,
      apiKey: {
        select: {
          name: true,
          user: { select: { username: true } },
        },
      },
    },
  });

  return NextResponse.json({ status: 200, data: logs });
}
