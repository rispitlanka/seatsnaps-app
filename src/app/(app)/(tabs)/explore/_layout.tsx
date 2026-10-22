import { Stack } from "expo-router";

import { c } from "@/ui/tokens";

/** Category and organiser pages keep the tab bar with Explore active (C3, C5). */
export default function ExploreStack() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.page }, animation: "slide_from_right" }} />;
}
