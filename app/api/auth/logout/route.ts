import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        // Log logout
        await logAuditEvent({
          userId: payload.userId,
          userRole: payload.role,
          action: "logout",
          resourceType: "auth",
          ipAddress: request.headers.get("x-forwarded-for") || undefined,
          userAgent: request.headers.get("user-agent") || undefined,
        });
      }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete("auth_token");
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

