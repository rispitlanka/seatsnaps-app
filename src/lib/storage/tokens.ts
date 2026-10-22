import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import type { StoredSession } from "@/types/auth";

const ACCESS_KEY = "seatsnaps.access_token";
const REFRESH_KEY = "seatsnaps.refresh_token";
const USER_KEY = "seatsnaps.user";

async function read(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

async function write(key: string, value: string | null): Promise<void> {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch {
      // Web private mode can block storage.
    }
    return;
  }

  if (value === null) {
    await SecureStore.deleteItemAsync(key);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function getAccessToken(): Promise<string | null> {
  return read(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return read(REFRESH_KEY);
}

export async function loadSession(): Promise<StoredSession | null> {
  const [accessToken, refreshToken, userRaw] = await Promise.all([
    read(ACCESS_KEY),
    read(REFRESH_KEY),
    read(USER_KEY),
  ]);

  if (!accessToken || !refreshToken || !userRaw) {
    return null;
  }

  try {
    return {
      accessToken,
      refreshToken,
      user: JSON.parse(userRaw),
    };
  } catch {
    return null;
  }
}

export async function saveSession(session: StoredSession): Promise<void> {
  await Promise.all([
    write(ACCESS_KEY, session.accessToken),
    write(REFRESH_KEY, session.refreshToken),
    write(USER_KEY, JSON.stringify(session.user)),
  ]);
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    write(ACCESS_KEY, null),
    write(REFRESH_KEY, null),
    write(USER_KEY, null),
  ]);
}
