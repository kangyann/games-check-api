import { getSession } from "@/lib/auth";
import { PrismaConnect } from "@/lib/prisma-config";
import { NextRequest, NextResponse } from "next/server";

const GameSelection = {
  id: true,
  name: true,
  codeGame: true,
  userId: true,
  serverId: true,
  prefix: true,
  status: true,
  updatedAt: true,
};
export async function GET(): Promise<NextResponse> {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }

  try {
    const listGames = await PrismaConnect.listGames.findMany({
      select: GameSelection,
    });
    return NextResponse.json(
      { status: 200, message: "List Games successfully retrieved.", data: listGames },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Internal Server Error." }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }
  const req = await request.json();
  if (!req) {
    return NextResponse.json({ status: 400, message: "Bad request. Check your body." }, { status: 400 });
  }

  try {
    const createListGame = await PrismaConnect.listGames.create({ data: req, select: GameSelection });
    return NextResponse.json(
      { status: 201, message: "List Games successfully added.", data: createListGame },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Internal Server Error." }, { status: 500 });
  }
}
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }
  const req: { id: number; data: Record<string, any> } = await request.json();
  if (!req) {
    return NextResponse.json({ status: 400, message: "Bad request. Check your body." }, { status: 400 });
  }
  try {
    const updateListGame = await PrismaConnect.listGames.update({
      where: { id: req.id },
      data: req.data,
      select: GameSelection,
    });
    return NextResponse.json(
      { status: 200, message: "List Games successfully updated.", data: updateListGame },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Internal Server Error." }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }
  const req: { id: number } = await request.json();
  if (!req) {
    return NextResponse.json({ status: 400, message: "Bad request. Check your body." }, { status: 400 });
  }
  try {
    const deleteListGame = await PrismaConnect.listGames.delete({ where: { id: req.id }, select: GameSelection });
    return NextResponse.json(
      { status: 200, message: "List Games successfully deleted.", data: deleteListGame },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Internal Server Error." }, { status: 500 });
  }
}
