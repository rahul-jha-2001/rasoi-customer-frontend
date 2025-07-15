// src/app/api/auth/otp-signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth-service";
import { OtpSignupRequest, AccessTokenResponse } from "@/lib/types";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { token, name, phone_number }: Partial<OtpSignupRequest> = body;
    console.log(body)
    console.log(token,name,phone_number)

    if (!token || !name || !phone_number) {
      return NextResponse.json(
        { error: "Missing required fields: token, name, or phone_number" },
        { status: 400 }
      );
    }

    const response: AccessTokenResponse = await authService.otpSignup({
      token,
      name,
      phone_number,
    });

    const res = NextResponse.json({ token: response.token }, { status: 200 });

    res.headers.set(
      "Set-Cookie",
      `session=${response.session_token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );

    return res;
  } catch (error) {
    console.error("OTP signup failed:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
};
