// src/app/api/auth/refresh-jwt/route.ts
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth-service";
import type { TokenRefreshRequest, AccessTokenResponse } from "@/lib/types";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { session_token }: TokenRefreshRequest = body;

    if (!session_token) {
      return NextResponse.json({ error: "Missing session_token" }, { status: 400 });
    }

    const response: AccessTokenResponse = await authService.refreshCustomerJwt({ session_token });

    return NextResponse.json({ token: response.token }, { status: 200 });
  } catch (error) {
    console.error("JWT refresh failed:", error);
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }
};
