import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";

import { Banner } from "@/components/ui/Banner";
import { Screen } from "@/components/ui/Screen";
import { getTicket } from "@/lib/api/bookings";
import { toErrorMessage } from "@/lib/api/errors";
import { formatEventWhen, formatMoney } from "@/lib/event-display";
import { colors, radii, spacing, typography } from "@/theme";
import type { OrderTicket } from "@/types/booking";

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ticket, setTicket] = useState<OrderTicket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!id) {
        return;
      }
      void getTicket(id)
        .then((next) => {
          setTicket(next);
          setError(null);
        })
        .catch((caught) => {
          setError(toErrorMessage(caught, "Could not load this ticket."));
        });
    }, [id]),
  );

  if (!ticket && !error) {
    return (
      <Screen edges={["bottom"]}>
        <ActivityIndicator color={colors.accent} />
      </Screen>
    );
  }

  if (error || !ticket) {
    return (
      <Screen edges={["bottom"]}>
        <Banner message={error ?? "Ticket not found."} />
      </Screen>
    );
  }

  return (
    <Screen edges={["bottom"]}>
      <View style={styles.qr}>
        <Text style={styles.ref}>{ticket.reference_id}</Text>
        <Text style={styles.caption}>Show this at the door</Text>
      </View>
      <Text style={styles.title}>{ticket.event?.name}</Text>
      {ticket.event?.start ? (
        <Text style={styles.meta}>{formatEventWhen(ticket.event.start, ticket.event.end)}</Text>
      ) : null}
      <Text style={styles.meta}>{ticket.seat?.code || ticket.ticket_category?.name || "Admission"}</Text>
      {ticket.price ? <Text style={styles.price}>{formatMoney(ticket.price)}</Text> : null}
      {ticket.check_in ? <Text style={styles.meta}>Checked in</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  qr: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  ref: {
    ...typography.display,
    color: colors.accent,
    fontVariant: ["tabular-nums"],
  },
  caption: { ...typography.caption, color: colors.textSubtle },
  title: { ...typography.title, color: colors.foreground, marginBottom: spacing.sm },
  meta: { ...typography.body, color: colors.textMuted },
  price: {
    ...typography.title,
    color: colors.foreground,
    fontVariant: ["tabular-nums"],
    marginTop: spacing.lg,
  },
});
