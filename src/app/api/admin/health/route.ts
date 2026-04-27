import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaConnect } from "@/lib/prisma-config";

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden.", status: 403 }, { status: 403 });
  }

  // Check database
  let dbStatus = "healthy";
  let dbLatency = 0;
  try {
    const start = Date.now();
    await PrismaConnect.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - start;
  } catch {
    dbStatus = "unhealthy";
  }

  // Check external API
  let apiStatus = "healthy";
  let apiLatency = 0;
  try {
    const start = Date.now();
    const res = await fetch(`${process.env.GAME_API_URL + "/openapi" || "https://api.omegatronik.co.id/openapi"}`, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    apiLatency = Date.now() - start;
    if (!res.ok && res.status !== 405) apiStatus = "unhealthy";
  } catch {
    apiStatus = "unhealthy";
  }

  return NextResponse.json({
    status: 200,
    data: {
      server: { status: "healthy", uptime: process.uptime() },
      database: { status: dbStatus, latency: dbLatency },
      externalApi: { status: apiStatus, latency: apiLatency },
    },
  });
}
