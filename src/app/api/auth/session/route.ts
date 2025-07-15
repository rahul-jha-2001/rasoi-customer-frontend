// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth-service";
import type { TokenRefreshRequest, AccessTokenResponse } from "@/lib/types";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { session_token: token }: Partial<TokenRefreshRequest> = body;

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const { session_token }: AccessTokenResponse = await authService.refreshCustomerSession({
      session_token: token,
    });

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.headers.set(
      "Set-Cookie",
      `session=${session_token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );

    return response;
  } catch (error) {
    console.error("Session setup failed:", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
};
