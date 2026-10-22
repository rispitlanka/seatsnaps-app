import { Stack } from "expo-router";

import { c } from "@/ui/tokens";

export default function EventStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: c.page },
        animation: "slide_from_right",
      }}
    />
  );
}
