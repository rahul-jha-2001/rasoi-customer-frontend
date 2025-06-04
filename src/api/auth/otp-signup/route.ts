// pages/api/auth/otp-signup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import authService from "@/lib/auth-service";
import { OtpSignupRequest, AccessTokenResponse } from "@/lib/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, name, phone_number }: Partial<OtpSignupRequest> = req.body;

  if (!token || !name || !phone_number) {
    return res.status(400).json({ error: "Missing required fields: token, name, or phone_number" });
  }

  try {
    const response: AccessTokenResponse = await authService.otpSignup({
      token,
      name,
      phone_number,
    });

    // Optionally set the session cookie (HTTP-only)
    res.setHeader("Set-Cookie", `session=${response.session_token}; Path=/; HttpOnly; Secure; SameSite=Strict`);

    // Return short-lived JWT to client
    res.status(200).json({ token: response.token });
  } catch (error: any) {
    console.error("OTP signup failed:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
}
