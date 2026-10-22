import type { TokenResponse } from "@/types/auth";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  loadSession,
  saveSession,
} from "@/lib/storage/tokens";
import { ApiError, parseApiError } from "./errors";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
  skipRefresh?: boolean;
  errorContext?: "login" | "signup" | "forgot" | "reset" | "profile" | "password" | "event";
};

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;
let refreshPromise: Promise<boolean> | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler;
}

function apiBaseUrl() {
  const raw = process.env.EXPO_PUBLIC_API_URL ?? "";
  return raw.replace(/\/$/, "");
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function persistTokens(data: TokenResponse) {
  const existing = await loadSession();
  const user = data.user ?? existing?.user;
  if (!user) {
    throw new ApiError("Session is missing user details. Please sign in again.", 401);
  }
  await saveSession({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user,
  });
}

async function refreshTokens(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    const base = apiBaseUrl();
    if (!base) {
      return false;
    }

    try {
      const response = await fetch(`${base}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const body = await parseBody(response);
      if (!response.ok) {
        return false;
      }
      await persistTokens(body as TokenResponse);
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const base = apiBaseUrl();
  if (!base) {
    throw new ApiError("Set EXPO_PUBLIC_API_URL in your .env file, then reload the app.", 0);
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const useAuth = options.auth ?? false;
  if (useAuth) {
    const accessToken = await getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError("Check your connection and try again.", 0);
  }

  if (response.status === 401 && useAuth && !options.skipRefresh) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, skipRefresh: true });
    }
    await clearSession();
    onUnauthorized?.();
    throw new ApiError("Your session expired. Please sign in again.", 401);
  }

  const body = await parseBody(response);
  if (!response.ok) {
    throw parseApiError(response.status, body, options.errorContext);
  }

  return body as T;
}

export { persistTokens };
