import { NextRequest, NextResponse } from "next/server";
import { PrismaConnect } from "@/lib/prisma-config";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, name } = body;

    if (!email || !username || !password) {
      return NextResponse.json(
        { message: "Email, username and password are required.", status: 400 },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters.", status: 400 },
        { status: 400 }
      );
    }

    const existingUser = await PrismaConnect.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            existingUser.email === email
              ? "Email already registered."
              : "Username already taken.",
          status: 409,
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await PrismaConnect.user.create({
      data: {
        email,
        username,
        name: name || null,
        password: hashedPassword,
        role: "MEMBER",
      },
    });

    await createSession(user.id, user.role);

    return NextResponse.json({
      message: "Account created successfully.",
      status: 201,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Internal server error.", status: 500 },
      { status: 500 }
    );
  }
}
