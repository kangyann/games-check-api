import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({
      message: "Logged out successfully.",
      status: 200,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error.", status: 500 },
      { status: 500 }
    );
  }
}
