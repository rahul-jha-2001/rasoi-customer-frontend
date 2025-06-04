import { apiFetch } from "./api-fetch";
import type {
  OtpSignupRequest,
  TokenRefreshRequest,
  AccessTokenResponse,
} from "./types";

const authService = {
  // 🔐 OTP-based customer signup
  otpSignup: async (
    data: OtpSignupRequest
  ): Promise<AccessTokenResponse> =>
    await apiFetch("/v1/auth/otp-signup", "POST", null, data, false),



  // 🔄 Refresh session for customer (Firebase session cookie)
  refreshCustomerSession: async (
    data: TokenRefreshRequest
  ): Promise<AccessTokenResponse> =>
    await apiFetch("/v1/auth/customer/token", "POST", null, data, false),


  // 🔁 Refresh customer JWT from session
  refreshCustomerJwt: async (
    data: TokenRefreshRequest
  ): Promise<AccessTokenResponse> =>
    await apiFetch("/v1/auth/customer/jwt", "POST", null, data, false),


};

export default authService;
