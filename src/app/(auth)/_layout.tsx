import { Stack } from "expo-router";

import { c } from "@/ui/tokens";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: c.white },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ animation: "fade" }} />
      <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
    </Stack>
  );
}
