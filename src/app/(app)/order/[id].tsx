import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";

import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { getOrder } from "@/lib/api/bookings";
import { toErrorMessage } from "@/lib/api/errors";
import { formatMoney } from "@/lib/event-display";
import { colors, radii, spacing, typography } from "@/theme";
import type { Order } from "@/types/booking";

export default function OrderStatusScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const next = await getOrder(id);
      setOrder(next);
      setError(null);
    } catch (caught) {
      setError(toErrorMessage(caught, "Could not load this order."));
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!order || order.status !== "PENDING_PAYMENT") {
      return;
    }
    const timer = setInterval(() => {
      void load();
    }, 2500);
    return () => clearInterval(timer);
  }, [load, order]);

  const tickets = order?.tickets ?? [];

  return (
    <Screen edges={["top", "bottom"]}>
      <Pressable onPress={() => router.replace("/me/tickets")} style={styles.back}>
        <Ionicons name="chevron-back" size={22} color={colors.foreground} />
        <Text style={styles.backLabel}>Order</Text>
      </Pressable>

      {!order && !error ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.muted}>Checking payment…</Text>
        </View>
      ) : null}

      {error ? <Banner message={error} /> : null}

      {order ? (
        <View style={styles.body}>
          <Text style={styles.status}>{statusCopy(order.status)}</Text>
          <Text style={styles.number}>{order.order_number}</Text>
          <Text style={styles.total}>{formatMoney(order.total) ?? "LKR 0"}</Text>
          <Text style={styles.muted}>{order.event?.name}</Text>

          {order.status === "PENDING_PAYMENT" ? (
            <Text style={styles.muted}>Waiting for PayHere. This can take a few seconds.</Text>
          ) : null}

          {order.status === "PAID" && tickets.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your tickets</Text>
              {tickets.map((ticket) => (
                <View key={ticket.id} style={styles.ticket}>
                  <Text style={styles.ref}>{ticket.reference_id}</Text>
                  <Text style={styles.muted}>
                    {ticket.seat?.code || ticket.ticket_category?.name || "Admission"}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <Button
            label={order.status === "PAID" ? "View my tickets" : "Back to Home"}
            onPress={() => router.replace(order.status === "PAID" ? "/me/tickets" : "/")}
            style={styles.cta}
          />
        </View>
      ) : null}
    </Screen>
  );
}

function statusCopy(status: Order["status"]) {
  switch (status) {
    case "PAID":
      return "You're in";
    case "PENDING_PAYMENT":
      return "Payment pending";
    case "FAILED":
      return "Payment didn’t go through";
    case "EXPIRED":
      return "This order expired";
    case "CANCELLED":
      return "Order cancelled";
    default:
      return status;
  }
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    marginLeft: -spacing.sm,
    marginBottom: spacing.lg,
  },
  backLabel: { ...typography.title, color: colors.foreground },
  center: { alignItems: "center", gap: spacing.md, paddingVertical: spacing.xxxl },
  body: { gap: spacing.md },
  status: { ...typography.display, color: colors.foreground },
  number: { ...typography.body, color: colors.accent, fontWeight: "600" },
  total: {
    ...typography.title,
    color: colors.foreground,
    fontVariant: ["tabular-nums"],
  },
  muted: { ...typography.body, color: colors.textSubtle },
  section: { marginTop: spacing.xl, gap: spacing.md },
  sectionTitle: { ...typography.title, color: colors.foreground },
  ticket: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  ref: { ...typography.title, color: colors.accent, fontVariant: ["tabular-nums"] },
  cta: { marginTop: spacing.xxxl },
});
