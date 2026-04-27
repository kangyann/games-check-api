import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { PrismaConnect } from "./prisma-config";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mylix-app-secret-key-change-in-production-2025"
);

const COOKIE_NAME = "mylix_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: {
  userId: number;
  role: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<{ userId: number; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as { userId: number; role: string };
  } catch {
    return null;
  }
}

export async function createSession(userId: number, role: string) {
  const token = await createToken({ userId, role });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await PrismaConnect.session.create({
    data: { userId, token, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const session = await PrismaConnect.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await PrismaConnect.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session.user;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    try {
      await PrismaConnect.session.deleteMany({ where: { token } });
    } catch {}
  }

  cookieStore.delete(COOKIE_NAME);
}

export function generateApiKey(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const prefix = "mlx_";
  let key = "";
  for (let i = 0; i < 40; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + key;
}

export async function checkRateLimit(
  userId: number,
  role: string
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  if (role === "VIP" || role === "ADMIN") {
    return { allowed: true, remaining: -1, limit: -1 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const limit = 1000;

  const count = await PrismaConnect.apiLog.count({
    where: {
      userId,
      createdAt: { gte: today },
    },
  });

  return {
    allowed: count < limit,
    remaining: Math.max(0, limit - count),
    limit,
  };
}
