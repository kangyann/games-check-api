import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mylix-app-secret-key-change-in-production-2025"
);

const protectedRoutes = ["/dashboard", "/admin"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("mylix_session")?.value;

  let user: { userId: number; role: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload as unknown as { userId: number; role: string };
    } catch {
      user = null;
    }
  }

  // Redirect logged-in users away from auth pages
  if (authRoutes.some((r) => pathname.startsWith(r)) && user) {
    const redirectTo = user.role === "ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
