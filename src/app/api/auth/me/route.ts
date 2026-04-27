import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized.", status: 401 },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Authenticated.",
      status: 200,
      data: user,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { message: "Internal server error.", status: 500 },
      { status: 500 }
    );
  }
}
