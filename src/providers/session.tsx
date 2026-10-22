import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import * as authApi from "@/lib/api/auth";
import { persistTokens, setUnauthorizedHandler } from "@/lib/api/client";
import { clearSession, loadSession, saveSession } from "@/lib/storage/tokens";
import type { AuthUser, SignupPayload, TokenResponse } from "@/types/auth";

type SessionContextValue = {
  session: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (payload: SignupPayload) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: AuthUser) => void;
  applyTokens: (data: TokenResponse) => Promise<void>;
  /** Enter the app with a local, unsaved session (UI preview builds only). */
  enterPreview: () => void;
};

/** EXPO_PUBLIC_UI_PREVIEW=1 lets sign-in skip the API so the UI can be reviewed offline. */
export const isUiPreview = process.env.EXPO_PUBLIC_UI_PREVIEW === "1";
const PREVIEW_TOKEN = "ui-preview";

const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const value = use(SessionContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUserState] = useState<AuthUser | null>(null);

  const applyTokens = useCallback(async (data: TokenResponse) => {
    await persistTokens(data);
    const stored = await loadSession();
    setAccessToken(data.access_token);
    setUserState(stored?.user ?? data.user ?? null);
  }, []);

  const signIn = useCallback(
    async (username: string, password: string) => {
      const data = await authApi.login(username, password);
      await applyTokens(data);
    },
    [applyTokens],
  );

  const signUp = useCallback(
    async (payload: SignupPayload) => {
      const data = await authApi.signup(payload);
      await applyTokens(data);
    },
    [applyTokens],
  );

  const signOut = useCallback(async () => {
    const stored = await loadSession();
    try {
      if (stored?.refreshToken) {
        await authApi.logout(stored.refreshToken, stored.accessToken);
      }
    } catch {
      // Always clear local session even if the network call fails.
    }
    await clearSession();
    setAccessToken(null);
    setUserState(null);
  }, []);

  const enterPreview = useCallback(() => {
    const previewUser: AuthUser = { id: "preview", email: "you@email.com", firstName: "Sam", username: "preview" };
    setAccessToken(PREVIEW_TOKEN);
    setUserState(previewUser);
    void saveSession({ accessToken: PREVIEW_TOKEN, refreshToken: PREVIEW_TOKEN, user: previewUser });
  }, []);

  const setUser = useCallback((next: AuthUser) => {
    setUserState(next);
    void loadSession().then((stored) => {
      if (!stored) {
        return;
      }
      void saveSession({ ...stored, user: next });
    });
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAccessToken(null);
      setUserState(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const stored = await loadSession();
      if (!active) {
        return;
      }
      if (!stored || (stored.accessToken === PREVIEW_TOKEN && !isUiPreview)) {
        if (stored) await clearSession();
        setIsLoading(false);
        return;
      }
      setAccessToken(stored.accessToken);
      if (stored.accessToken === PREVIEW_TOKEN) {
        setUserState(stored.user);
        setIsLoading(false);
        return;
      }
      setUserState(stored.user);
      try {
        const me = await authApi.getMe();
        if (active) {
          setUser(me);
        }
      } catch {
        // Keep cached user if /auth/me fails for a non-auth reason.
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [setUser]);

  const value = useMemo<SessionContextValue>(
    () => ({
      session: accessToken,
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      setUser,
      applyTokens,
      enterPreview,
    }),
    [accessToken, applyTokens, enterPreview, isLoading, setUser, signIn, signOut, signUp, user],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
