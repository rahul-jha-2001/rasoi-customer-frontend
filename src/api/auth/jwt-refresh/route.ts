// pages/api/auth/refresh-jwt.ts
import type { NextApiRequest, NextApiResponse } from "next";
import authService from "@/lib/auth-service";
import type { TokenRefreshRequest, AccessTokenResponse } from "@/lib/types";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { session_token}: TokenRefreshRequest = req.body;

  if (!session_token) {
    return res.status(400).json({ error: "Missing session_token" });
  }

  try {
    const response = await authService.refreshCustomerJwt({ session_token });
    return res.status(200).json({ token: response.token });
  } catch (error: any) {
    console.error("JWT refresh failed:", error);
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}
