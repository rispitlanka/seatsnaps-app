import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";

import { ChoiceChips } from "@/components/booking/ChoiceChips";
import { QtyStepper } from "@/components/booking/QtyStepper";
import { SeatMap } from "@/components/booking/SeatMap";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { createHold, listEventOffers } from "@/lib/api/bookings";
import { getEventById } from "@/lib/api/events";
import { toErrorMessage } from "@/lib/api/errors";
import {
  cartCount,
  isSeatedZone,
  standingRemaining,
  ticketsForZone,
} from "@/lib/booking";
import { formatMoney } from "@/lib/event-display";
import { useBooking } from "@/providers/booking";
import { colors, radii, spacing, typography } from "@/theme";
import type { EventOffer } from "@/types/booking";
import type { Event, EventSeat } from "@/types/event";

export default function SelectTicketsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setHold, promoCode, setPromoCode } = useBooking();
  const [event, setEvent] = useState<Event | null>(null);
  const [offers, setOffers] = useState<EventOffer[]>([]);
  const [seatIds, setSeatIds] = useState<string[]>([]);
  const [standing, setStanding] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [holding, setHolding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [nextEvent, nextOffers] = await Promise.all([
        getEventById(id),
        listEventOffers(id),
      ]);
      setEvent(nextEvent);
      setOffers(nextOffers);
    } catch (caught) {
      setError(toErrorMessage(caught, "Could not load seats."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const limit = event?.ticket_limit ?? 10;
  const count = cartCount(seatIds, standing);
  const remainingSlots = Math.max(0, limit - count);

  const seatedZones = useMemo(
    () => (event?.zones ?? []).filter((zone) => isSeatedZone(zone) && (zone.seats?.length ?? 0) > 0),
    [event],
  );
  const standingZones = useMemo(
    () => (event?.zones ?? []).filter((zone) => !isSeatedZone(zone)),
    [event],
  );

  function toggleSeat(seat: EventSeat) {
    setError(null);
    setSeatIds((current) => {
      if (current.includes(seat.id)) {
        return current.filter((value) => value !== seat.id);
      }
      if (current.length + Object.values(standing).reduce((sum, qty) => sum + qty, 0) >= limit) {
        setError(`You can take at most ${limit} tickets.`);
        return current;
      }
      return [...current, seat.id];
    });
  }

  function setStandingQty(ticketId: string, quantity: number) {
    setError(null);
    setStanding((current) => {
      const others =
        seatIds.length +
        Object.entries(current).reduce(
          (sum, [key, qty]) => (key === ticketId ? sum : sum + qty),
          0,
        );
      const nextQty = Math.min(quantity, Math.max(0, limit - others));
      return { ...current, [ticketId]: nextQty };
    });
  }

  async function onHold() {
    if (!event) {
      return;
    }
    const standingItems = Object.entries(standing)
      .filter(([, quantity]) => quantity > 0)
      .map(([ticketCategoryId, quantity]) => ({ ticketCategoryId, quantity }));
    if (seatIds.length === 0 && standingItems.length === 0) {
      setError("Pick a seat or a standing ticket.");
      return;
    }

    setHolding(true);
    setError(null);
    try {
      const hold = await createHold({
        eventId: event.id,
        ...(seatIds.length ? { seatIds } : {}),
        ...(standingItems.length ? { standing: standingItems } : {}),
        ...(promoCode.trim() ? { promoCode: promoCode.trim().toUpperCase() } : {}),
      });
      setHold(hold);
      router.push({ pathname: "/event/[id]/checkout", params: { id: event.id } });
    } catch (caught) {
      setError(toErrorMessage(caught, "Could not hold those tickets."));
    } finally {
      setHolding(false);
    }
  }

  if (loading) {
    return (
      <Screen edges={["top", "bottom"]}>
        <Header title="Choose tickets" />
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      </Screen>
    );
  }

  if (!event) {
    return (
      <Screen edges={["top", "bottom"]}>
        <Header title="Choose tickets" />
        <Banner message={error ?? "Could not load this show."} />
        <Button label="Try again" onPress={() => void load()} />
      </Screen>
    );
  }

  return (
    <Screen edges={["top", "bottom"]}>
      <Header title="Choose tickets" />
      <Text style={styles.eventName}>{event.name}</Text>
      <Text style={styles.hint}>
        Max {limit} tickets. Seats stay held for 10 minutes after you continue.
      </Text>

      {error ? <Banner message={error} /> : null}

      {seatedZones.map((zone) => (
        <View key={zone.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{zone.name}</Text>
          <SeatMap
            zone={zone}
            layout={event.layout}
            selectedIds={seatIds}
            onToggle={toggleSeat}
          />
        </View>
      ))}

      {standingZones.map((zone) => {
        const tickets = ticketsForZone(event, zone);
        if (tickets.length === 0) {
          return null;
        }
        return (
          <View key={zone.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{zone.name}</Text>
            {tickets.map((ticket) => {
              const left = standingRemaining(ticket);
              const current = standing[ticket.id] ?? 0;
              const max = Math.min(left, current + remainingSlots);
              return (
                <View key={ticket.id} style={styles.gaRow}>
                  <View style={styles.gaCopy}>
                    <Text style={styles.gaName}>{ticket.name}</Text>
                    <Text style={styles.hint}>
                      {event.is_free ? "Free" : formatMoney(ticket.price)} · {left} left
                    </Text>
                  </View>
                  <QtyStepper
                    value={current}
                    max={max}
                    onChange={(value) => setStandingQty(ticket.id, value)}
                  />
                </View>
              );
            })}
          </View>
        );
      })}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Promo</Text>
        <TextField
          label="Promo code"
          value={promoCode}
          onChangeText={setPromoCode}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
        />
        {offers.length > 0 ? (
          <ChoiceChips
            options={offers.map((offer) => offer.promo_code)}
            value={promoCode}
            onChange={(value) => setPromoCode(String(value))}
          />
        ) : null}
      </View>

      <View style={styles.footer}>
        <Text style={styles.count}>{count} selected</Text>
        <Button
          label="Hold tickets"
          onPress={() => void onHold()}
          loading={holding}
          disabled={count === 0}
          style={styles.cta}
        />
      </View>
    </Screen>
  );
}

function Header({ title }: { title: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.back()}
      style={styles.back}
    >
      <Ionicons name="chevron-back" size={22} color={colors.foreground} />
      <Text style={styles.backLabel}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    marginLeft: -spacing.sm,
    marginBottom: spacing.md,
  },
  backLabel: { ...typography.title, color: colors.foreground },
  eventName: { ...typography.body, color: colors.textMuted, marginBottom: spacing.sm },
  hint: { ...typography.caption, color: colors.textSubtle, marginBottom: spacing.lg },
  center: { paddingVertical: spacing.xxxl, alignItems: "center" },
  section: { marginBottom: spacing.xxl, gap: spacing.md },
  sectionTitle: { ...typography.title, color: colors.foreground },
  gaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gaCopy: { flex: 1, gap: spacing.xs },
  gaName: { ...typography.body, fontWeight: "600", color: colors.foreground },
  footer: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingTop: spacing.xl,
  },
  count: { ...typography.body, color: colors.textMuted, fontWeight: "600" },
  cta: { flex: 1 },
});
