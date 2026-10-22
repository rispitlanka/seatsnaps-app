import { Stack } from "expo-router";

import { BookingProvider } from "@/providers/booking";
import { CartProvider } from "@/providers/cart";
import { PrefsProvider } from "@/providers/prefs";
import { c } from "@/ui/tokens";

export default function AppLayout() {
  return (
    <BookingProvider>
      <CartProvider>
        <PrefsProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: c.page },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="search" options={{ animation: "fade" }} />
          <Stack.Screen
            name="filters"
            options={{ presentation: "transparentModal", animation: "slide_from_bottom", contentStyle: { backgroundColor: "transparent" } }}
          />
          <Stack.Screen name="booking/processing" options={{ animation: "fade", gestureEnabled: false }} />
          <Stack.Screen name="booking/confirmed" options={{ animation: "fade", gestureEnabled: false }} />
          <Stack.Screen name="booking/expired" options={{ animation: "fade", gestureEnabled: false }} />
          <Stack.Screen name="dates" options={{ presentation: "transparentModal", animation: "slide_from_bottom", contentStyle: { backgroundColor: "transparent" } }} />
          <Stack.Screen name="sign-out" options={{ presentation: "transparentModal", animation: "fade", contentStyle: { backgroundColor: "transparent" } }} />
          <Stack.Screen name="delete-account" options={{ presentation: "transparentModal", animation: "slide_from_bottom", contentStyle: { backgroundColor: "transparent" } }} />
          <Stack.Screen name="me/booking/gate" options={{ presentation: "modal" }} />
          <Stack.Screen name="photo" options={{ presentation: "transparentModal", animation: "slide_from_bottom", contentStyle: { backgroundColor: "transparent" } }} />
          <Stack.Screen name="booking/ticket" options={{ presentation: "modal" }} />
          <Stack.Screen name="city" options={{ presentation: "modal" }} />
          <Stack.Screen name="location" options={{ animation: "fade" }} />
          <Stack.Screen name="push" options={{ animation: "fade" }} />
        </Stack>
        </PrefsProvider>
      </CartProvider>
    </BookingProvider>
  );
}
