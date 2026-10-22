import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { isPayhereReturnUrl, payhereCheckoutHtml } from "@/lib/payhere";
import { useBooking } from "@/providers/booking";
import { colors, spacing, typography } from "@/theme";

export default function PayHereScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { payhere, setPayhere } = useBooking();
  const html = useMemo(() => (payhere ? payhereCheckoutHtml(payhere) : null), [payhere]);

  function finish() {
    setPayhere(null);
    router.replace({ pathname: "/order/[id]", params: { id: id ?? "" } });
  }

  if (!payhere || !html || !id) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <Text style={styles.missing}>Payment session expired. Check the order status.</Text>
        <Button label="View order" onPress={() => router.replace({ pathname: "/order/[id]", params: { id: id ?? "" } })} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Pressable onPress={finish} style={styles.back}>
        <Ionicons name="close" size={22} color={colors.foreground} />
        <Text style={styles.backLabel}>Close payment</Text>
      </Pressable>
      <WebView
        originWhitelist={["*"]}
        source={{ html, baseUrl: "https://www.payhere.lk" }}
        style={styles.web}
        onNavigationStateChange={(nav) => {
          if (nav.url && isPayhereReturnUrl(nav.url, payhere)) {
            finish();
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  back: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  backLabel: { ...typography.body, color: colors.foreground },
  web: { flex: 1, backgroundColor: colors.background },
  missing: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg, marginTop: spacing.xl },
});
