import { NextRequest, NextResponse } from "next/server";
import { getSession, verifyPassword, hashPassword } from "@/lib/auth";
import { PrismaConnect } from "@/lib/prisma-config";

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized.", status: 401 }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, username } = body;

  try {
    if (email && email !== user.email) {
      const existing = await PrismaConnect.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ message: "Email already in use.", status: 409 }, { status: 409 });
      }
    }

    if (username && username !== user.username) {
      const existing = await PrismaConnect.user.findUnique({ where: { username } });
      if (existing) {
        return NextResponse.json({ message: "Username already taken.", status: 409 }, { status: 409 });
      }
    }

    await PrismaConnect.user.update({
      where: { id: user.id },
      data: {
        name: name || null,
        email: email || user.email,
        username: username || user.username,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully.", status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Failed to update profile.", status: 500 }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized.", status: 401 }, { status: 401 });
  }

  const body = await request.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: "Both passwords are required.", status: 400 }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ message: "New password must be at least 6 characters.", status: 400 }, { status: 400 });
  }

  const fullUser = await PrismaConnect.user.findUnique({ where: { id: user.id } });
  if (!fullUser) {
    return NextResponse.json({ message: "User not found.", status: 404 }, { status: 404 });
  }

  const valid = await verifyPassword(currentPassword, fullUser.password);
  if (!valid) {
    return NextResponse.json({ message: "Current password is incorrect.", status: 401 }, { status: 401 });
  }

  const hashed = await hashPassword(newPassword);
  await PrismaConnect.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return NextResponse.json({ message: "Password updated successfully.", status: 200 });
}
