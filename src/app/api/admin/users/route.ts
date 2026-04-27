import { NextRequest, NextResponse } from "next/server";
import { getSession, hashPassword } from "@/lib/auth";
import { PrismaConnect } from "@/lib/prisma-config";

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }

  const search = request.nextUrl.searchParams.get("search") || "";
  const role = request.nextUrl.searchParams.get("role") || "";

  const where: any = {};
  if (search) {
    where.OR = [
      { username: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role) {
    where.role = role;
  }

  const users = await PrismaConnect.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { apiKeys: true } },
    },
  });

  return NextResponse.json({ status: 200, data: users });
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }

  const body = await request.json();
  const { name, username, email, password, role, isActive } = body;

  if (!email || !username || !password) {
    return NextResponse.json(
      { message: "Email, username and password are required.", status: 400 },
      { status: 400 }
    );
  }

  const existing = await PrismaConnect.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    return NextResponse.json(
      {
        message: existing.email === email ? "Email already registered." : "Username already taken.",
        status: 409,
      },
      { status: 409 }
    );
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await PrismaConnect.user.create({
    data: {
      name: name || null,
      username,
      email,
      password: hashedPassword,
      role: role || "MEMBER",
      isActive: isActive !== undefined ? isActive : true,
    },
    select: { id: true, username: true, email: true, role: true },
  });

  return NextResponse.json({ status: 201, data: newUser });
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }

  const body = await request.json();
  const { userId, role, isActive, name, username, email, password } = body;

  if (!userId) {
    return NextResponse.json({ message: "userId required.", status: 400 }, { status: 400 });
  }

  const updateData: any = {};
  if (role !== undefined) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (name !== undefined) updateData.name = name || null;

  if (username !== undefined) {
    const existing = await PrismaConnect.user.findFirst({
      where: { username, NOT: { id: userId } },
    });
    if (existing) {
      return NextResponse.json({ message: "Username already taken.", status: 409 }, { status: 409 });
    }
    updateData.username = username;
  }

  if (email !== undefined) {
    const existing = await PrismaConnect.user.findFirst({
      where: { email, NOT: { id: userId } },
    });
    if (existing) {
      return NextResponse.json({ message: "Email already in use.", status: 409 }, { status: 409 });
    }
    updateData.email = email;
  }

  if (password) {
    updateData.password = await hashPassword(password);
  }

  const updated = await PrismaConnect.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, username: true, role: true, isActive: true },
  });

  return NextResponse.json({ status: 200, data: updated });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }

  const body = await request.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ message: "userId required.", status: 400 }, { status: 400 });
  }

  // Prevent self-deletion
  if (userId === user.id) {
    return NextResponse.json({ message: "Cannot delete yourself.", status: 400 }, { status: 400 });
  }

  await PrismaConnect.user.delete({ where: { id: userId } });

  return NextResponse.json({ status: 200, message: "User deleted." });
}
