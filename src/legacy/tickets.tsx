import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";

import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { listOrders, listTickets } from "@/lib/api/bookings";
import { toErrorMessage } from "@/lib/api/errors";
import { eventCoverUrl, formatEventWhen, formatMoney } from "@/lib/event-display";
import { colors, radii, spacing, typography } from "@/theme";
import type { Order, OrderTicket } from "@/types/booking";

export default function TicketsScreen() {
  const [tickets, setTickets] = useState<OrderTicket[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      const [nextTickets, nextOrders] = await Promise.all([listTickets(), listOrders()]);
      setTickets(nextTickets);
      setOrders(nextOrders);
      setError(null);
    } catch (caught) {
      setError(toErrorMessage(caught, "Could not load bookings."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const pending = orders.filter((order) => order.status === "PENDING_PAYMENT");

  return (
    <Screen
      edges={["top"]}
      refreshControl={
        <RefreshControl
          tintColor={colors.accent}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            void load(true);
          }}
        />
      }
    >
      <Text style={styles.kicker}>Wallet</Text>
      <Text style={styles.title}>Your tickets</Text>

      {error ? (
        <View style={styles.block}>
          <Banner message={error} />
          <Button label="Try again" onPress={() => void load()} />
        </View>
      ) : null}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <View style={styles.feed}>
          {pending.map((order) => (
            <Pressable
              key={order.id}
              onPress={() => router.push({ pathname: "/order/[id]", params: { id: order.id } })}
              style={styles.pending}
            >
              <Text style={styles.pendingLabel}>Payment pending</Text>
              <Text style={styles.rowTitle}>{order.event?.name ?? order.order_number}</Text>
              <Text style={styles.meta}>{formatMoney(order.total)}</Text>
            </Pressable>
          ))}

          {tickets.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No tickets yet</Text>
              <Text style={styles.meta}>
                After you pay, tickets land here with a reference you can show at the door.
              </Text>
              <Button label="Find a show" onPress={() => router.replace("/")} style={styles.cta} />
            </View>
          ) : (
            tickets.map((ticket) => (
              <Pressable
                key={ticket.id}
                onPress={() => router.push({ pathname: "/tickets/[id]", params: { id: ticket.id } })}
                style={styles.card}
              >
                {ticket.event && eventCoverUrl(ticket.event) ? (
                  <Image
                    source={{ uri: eventCoverUrl(ticket.event)! }}
                    style={styles.cover}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.cover, styles.coverFallback]} />
                )}
                <View style={styles.cardBody}>
                  <Text style={styles.ref}>{ticket.reference_id}</Text>
                  <Text style={styles.rowTitle}>{ticket.event?.name}</Text>
                  {ticket.event?.start ? (
                    <Text style={styles.meta}>{formatEventWhen(ticket.event.start, ticket.event.end)}</Text>
                  ) : null}
                  <Text style={styles.meta}>
                    {ticket.seat?.code || ticket.ticket_category?.name || "Admission"}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  title: { ...typography.display, color: colors.foreground, marginBottom: spacing.xl },
  block: { gap: spacing.md, marginBottom: spacing.lg },
  center: { paddingVertical: spacing.xxxl, alignItems: "center" },
  feed: { gap: spacing.lg },
  pending: {
    backgroundColor: colors.accentMuted,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  pendingLabel: { ...typography.caption, color: colors.accent, fontWeight: "600" },
  empty: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: { ...typography.title, color: colors.foreground },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cover: { height: 120, backgroundColor: colors.surfaceAlt },
  coverFallback: { backgroundColor: colors.primaryMuted },
  cardBody: { padding: spacing.lg, gap: spacing.xs },
  ref: { ...typography.body, color: colors.accent, fontWeight: "600" },
  rowTitle: { ...typography.title, color: colors.foreground },
  meta: { ...typography.caption, color: colors.textSubtle },
  cta: { marginTop: spacing.md },
});
