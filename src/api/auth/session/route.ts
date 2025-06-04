// pages/api/auth/session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import authService from "@/lib/auth-service";
import type { TokenRefreshRequest, AccessTokenResponse } from "@/lib/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { session_token:token }: Partial<TokenRefreshRequest> = req.body;

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  try {
    const { session_token }: AccessTokenResponse = await authService.refreshCustomerSession({ session_token:token });

    // Set the session cookie (HTTP-only)
    res.setHeader("Set-Cookie", `session=${session_token}; Path=/; HttpOnly; Secure; SameSite=Strict`);

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Session setup failed:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
