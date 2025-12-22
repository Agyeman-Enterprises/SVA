import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { isInspector, type ResourceType, type Action } from "@/lib/rbac";

/**
 * RBAC middleware for Next.js App Router
 * Enforces role-based access control on API routes
 * Inspector read-only enforcement is hard-coded here
 */
export function middleware(request: NextRequest) {
  // Skip middleware for public routes
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Extract token from Authorization header or cookie
  const token =
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    request.cookies.get("auth_token")?.value;

  if (!token) {
    // Allow public routes, but require auth for protected routes
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const payload = verifyToken(token);
  if (!payload) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Attach user info to request headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-role", payload.role);
  requestHeaders.set("x-user-email", payload.email);
  if (payload.membershipId) {
    requestHeaders.set("x-membership-id", payload.membershipId);
  }
  if (payload.scope) {
    requestHeaders.set("x-scope", payload.scope);
  }

  // Inspector read-only enforcement (HARD RULE)
  // Inspectors cannot mutate data - enforced at middleware level
  if (isInspector(payload.role)) {
    const method = request.method;
    if (method !== "GET" && method !== "HEAD" && request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json(
        { 
          error: "Inspectors have read-only access",
          message: "All mutations are blocked for inspector role"
        },
        { status: 403 }
      );
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
