import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaConnect } from "@/lib/prisma-config";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized.", status: 401 }, { status: 401 });
  }

  const notifications = await PrismaConnect.notification.findMany({
    where: {
      OR: [
        { userId: user.id },
        { isGlobal: true },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = await PrismaConnect.notification.count({
    where: {
      OR: [
        { userId: user.id, isRead: false },
        { isGlobal: true, isRead: false },
      ],
    },
  });

  return NextResponse.json({ status: 200, data: notifications, unreadCount });
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized.", status: 401 }, { status: 401 });
  }

  const body = await request.json();
  const { id, markAllRead } = body;

  if (markAllRead) {
    await PrismaConnect.notification.updateMany({
      where: {
        OR: [{ userId: user.id }, { isGlobal: true }],
        isRead: false,
      },
      data: { isRead: true },
    });
    return NextResponse.json({ status: 200, message: "All marked as read." });
  }

  if (id) {
    await PrismaConnect.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return NextResponse.json({ status: 200, message: "Marked as read." });
  }

  return NextResponse.json({ message: "No action.", status: 400 }, { status: 400 });
}
