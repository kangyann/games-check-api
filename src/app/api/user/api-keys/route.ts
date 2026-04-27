import { NextRequest, NextResponse } from "next/server";
import { getSession, generateApiKey } from "@/lib/auth";
import { PrismaConnect } from "@/lib/prisma-config";

// API key limits per role
const API_KEY_LIMITS: Record<string, number> = {
  MEMBER: 3,
  VIP: 10,
  ADMIN: 50,
};

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized.", status: 401 }, { status: 401 });
  }

  const keys = await PrismaConnect.apiKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      key: true,
      name: true,
      isActive: true,
      createdAt: true,
      _count: { select: { logs: true } },
    },
  });

  const limit = API_KEY_LIMITS[user.role] ?? 3;

  return NextResponse.json({ status: 200, data: keys, limit });
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized.", status: 401 }, { status: 401 });
  }

  // Check limit
  const currentCount = await PrismaConnect.apiKey.count({ where: { userId: user.id } });
  const limit = API_KEY_LIMITS[user.role] ?? 3;

  if (currentCount >= limit) {
    return NextResponse.json(
      {
        message: `API key limit reached (${limit}). ${user.role === "MEMBER" ? "Upgrade to VIP for more keys." : "Contact admin."}`,
        status: 403,
      },
      { status: 403 }
    );
  }

  const body = await request.json();
  const key = generateApiKey();

  const apiKey = await PrismaConnect.apiKey.create({
    data: {
      userId: user.id,
      key,
      name: body.name || "Default",
    },
  });

  return NextResponse.json({ status: 201, data: apiKey });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized.", status: 401 }, { status: 401 });
  }

  const body = await request.json();
  const { id } = body;

  await PrismaConnect.apiKey.deleteMany({
    where: { id, userId: user.id },
  });

  return NextResponse.json({ status: 200, message: "API key revoked." });
}
