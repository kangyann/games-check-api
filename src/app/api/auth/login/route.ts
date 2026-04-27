import { NextRequest, NextResponse } from "next/server";
import { PrismaConnect } from "@/lib/prisma-config";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required.", status: 400 },
        { status: 400 }
      );
    }

    const user = await PrismaConnect.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password.", status: 401 },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "Account is disabled. Contact support.", status: 403 },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid email or password.", status: 401 },
        { status: 401 }
      );
    }

    await createSession(user.id, user.role);

    return NextResponse.json({
      message: "Login successful.",
      status: 200,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error.", status: 500 },
      { status: 500 }
    );
  }
}
