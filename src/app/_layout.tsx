import { DesignProvider } from "@/features/designs/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";

import { SessionProvider, useSession } from "@/providers/session";
import { SplashScreenController } from "@/providers/splash";
import { c } from "@/ui/tokens";

void SystemUI.setBackgroundColorAsync(c.white);

export default function Root() {
  return (
    // DesignProvider also loads the Plus Jakarta Sans fonts used by every screen.
    <DesignProvider>
      <SessionProvider>
        <SplashScreenController />
        <StatusBar style="dark" />
        <RootNavigator />
      </SessionProvider>
    </DesignProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useSession();

  // The native splash stays up until the stored session is known.
  if (isLoading) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: c.white },
        animation: "fade",
      }}
    >
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Screen name="forgot-password" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="verify-code" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="reset-password" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="legal" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="offline" />
      <Stack.Screen name="update" />
      <Stack.Screen name="maintenance" />
      <Stack.Screen name="shared/[id]" />
      <Stack.Screen name="screens/[id]" />
      <Stack.Screen name="screen-library" />
    </Stack>
  );
}
