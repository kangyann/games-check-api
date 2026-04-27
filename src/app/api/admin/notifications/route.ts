import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaConnect } from "@/lib/prisma-config";

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }

  const type = request.nextUrl.searchParams.get("type") || "";

  const where: any = {};
  if (type) where.type = type;

  const notifications = await PrismaConnect.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { username: true, email: true } },
    },
  });

  return NextResponse.json({ status: 200, data: notifications });
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }

  const body = await request.json();
  const { title, message, type, isGlobal, userId } = body;

  if (!title || !message) {
    return NextResponse.json({ message: "Title and message required.", status: 400 }, { status: 400 });
  }

  const notif = await PrismaConnect.notification.create({
    data: {
      title,
      message,
      type: type || "INFO",
      isGlobal: isGlobal ?? false,
      userId: isGlobal ? null : (userId || null),
    },
  });

  return NextResponse.json({ status: 201, data: notif });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }

  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ message: "ID required.", status: 400 }, { status: 400 });
  }

  await PrismaConnect.notification.delete({ where: { id } });

  return NextResponse.json({ status: 200, message: "Notification deleted." });
}
