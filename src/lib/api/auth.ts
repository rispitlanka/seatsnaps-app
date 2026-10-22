import type {
  AuthUser,
  MessageResponse,
  SignupPayload,
  TokenResponse,
  UpdateProfilePayload,
} from "@/types/auth";
import { apiRequest } from "./client";

export function login(username: string, password: string) {
  return apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    body: { username, password },
    errorContext: "login",
  });
}

export function signup(payload: SignupPayload) {
  return apiRequest<TokenResponse>("/auth/signup", {
    method: "POST",
    body: payload,
    errorContext: "signup",
  });
}

export function forgotPassword(email: string) {
  return apiRequest<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: { email },
    errorContext: "forgot",
  });
}

export function resetPassword(email: string, otp: string, newPassword: string) {
  return apiRequest<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: { email, otp, newPassword },
    errorContext: "reset",
  });
}

export async function logout(refreshToken: string, accessToken?: string | null) {
  const body = { refresh_token: refreshToken };
  try {
    return await apiRequest<MessageResponse>("/auth/logout", {
      method: "POST",
      body,
      auth: Boolean(accessToken),
      skipRefresh: true,
    });
  } catch {
    return apiRequest<MessageResponse>("/auth/logout", {
      method: "POST",
      body,
    });
  }
}

export function getMe() {
  return apiRequest<AuthUser>("/auth/me", { auth: true });
}

export function updateMe(payload: UpdateProfilePayload) {
  return apiRequest<AuthUser>("/auth/me", {
    method: "PATCH",
    body: payload,
    auth: true,
    errorContext: "profile",
  });
}

export function changePassword(oldPassword: string, newPassword: string) {
  return apiRequest<MessageResponse>("/auth/change-password", {
    method: "POST",
    body: { oldPassword, newPassword },
    auth: true,
    errorContext: "password",
  });
}
