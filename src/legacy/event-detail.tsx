import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";

import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { getEventById, getEventBySlug, listEventSessions } from "@/lib/api/events";
import { toErrorMessage } from "@/lib/api/errors";
import {
  eventCoverUrl,
  formatEventWhen,
  formatMoney,
  formatRegistrationWindow,
  isSingleDayEvent,
  lowestPriceLabel,
  mediaUrl,
  ticketAvailability,
} from "@/lib/event-display";
import { colors, radii, spacing, typography } from "@/theme";
import type { Event, EventSession } from "@/types/event";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [sessions, setSessions] = useState<EventSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setError("This show could not be found.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const next = isEventId(id) ? await getEventById(id) : await getEventBySlug(id);
      setEvent(next);
      const embedded = next.sessions ?? [];
      if (embedded.length > 0) {
        setSessions(embedded);
      } else {
        setSessions(await listEventSessions(next.id));
      }
    } catch (caught) {
      setError(toErrorMessage(caught, "Could not open this show."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <Screen edges={["top", "bottom"]}>
        <BackButton />
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.muted}>Opening show…</Text>
        </View>
      </Screen>
    );
  }

  if (error || !event) {
    return (
      <Screen edges={["top", "bottom"]}>
        <BackButton />
        <View style={styles.errorBlock}>
          <Banner message={error ?? "This show could not be found."} />
          <Button label="Try again" onPress={() => void load()} />
        </View>
      </Screen>
    );
  }

  const cover = eventCoverUrl(event);
  const orgImage = mediaUrl(event.organization?.org_image);
  const location = [event.venue?.name, event.venue?.address || event.venue?.city]
    .filter(Boolean)
    .join("\n");
  const price = lowestPriceLabel(event);
  const registration = formatRegistrationWindow(
    event.registration_open,
    event.registration_close,
  );
  const scheduledSessions = sessions.filter((session) => session.status !== "CANCELLED");
  const tickets = (event.ticket_categories ?? []).filter((ticket) => !ticket.is_closed);
  const tags = event.tags ?? [];
  const zones = event.zones ?? [];

  return (
    <Screen edges={["top", "bottom"]} contentStyle={styles.content}>
      <BackButton />
      <View style={styles.cover}>
        {cover ? (
          <Image source={{ uri: cover }} style={styles.coverImage} contentFit="cover" transition={200} />
        ) : (
          <View style={styles.coverFallback} />
        )}
        <View style={styles.badges}>
          {event.is_featured ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Featured</Text>
            </View>
          ) : null}
          {event.is_free ? (
            <View style={[styles.badge, styles.badgeFree]}>
              <Text style={styles.badgeText}>Free</Text>
            </View>
          ) : null}
        </View>
      </View>

      {event.category?.name ? <Text style={styles.category}>{event.category.name}</Text> : null}
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.when}>{formatEventWhen(event.start, event.end)}</Text>
      {isSingleDayEvent(event) ? (
        <Text style={styles.muted}>Single-day show</Text>
      ) : (
        <Text style={styles.muted}>
          {scheduledSessions.length} {scheduledSessions.length === 1 ? "session" : "sessions"}
        </Text>
      )}

      {tags.length > 0 ? (
        <View style={styles.tagRow}>
          {tags.map((tag) => (
            <View key={tag.id} style={styles.tag}>
              <Text style={styles.tagText}>{tag.name}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {location ? (
        <View style={styles.block}>
          <Text style={styles.blockLabel}>Location</Text>
          <Text style={styles.blockValue}>{location}</Text>
        </View>
      ) : null}

      {event.organization?.name ? (
        <View style={styles.org}>
          {orgImage ? (
            <Image source={{ uri: orgImage }} style={styles.orgImage} contentFit="cover" />
          ) : (
            <View style={styles.orgFallback}>
              <Text style={styles.orgInitial}>{event.organization.name[0]}</Text>
            </View>
          )}
          <View style={styles.orgCopy}>
            <Text style={styles.blockLabel}>Presented by</Text>
            <Text style={styles.blockValue}>{event.organization.name}</Text>
          </View>
        </View>
      ) : null}

      {event.description ? (
        <Text style={styles.description}>{event.description}</Text>
      ) : null}

      {scheduledSessions.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sessions</Text>
          {scheduledSessions.map((session) => (
            <View key={session.id} style={styles.rowCard}>
              <Text style={styles.rowTitle}>{session.label || "Session"}</Text>
              <Text style={styles.muted}>{formatEventWhen(session.start, session.end)}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tickets</Text>
        {tickets.length === 0 ? (
          <Text style={styles.muted}>Ticket details will appear here when sales open.</Text>
        ) : (
          tickets.map((ticket) => {
            const left = ticketAvailability(ticket);
            return (
              <View key={ticket.id} style={styles.rowCard}>
                <View style={styles.ticketHead}>
                  <Text style={styles.rowTitle}>{ticket.name}</Text>
                  <Text style={styles.price}>{event.is_free ? "Free" : formatMoney(ticket.price)}</Text>
                </View>
                {ticket.type ? (
                  <Text style={styles.muted}>{ticket.type.replaceAll("_", " ")}</Text>
                ) : null}
                {left !== null ? <Text style={styles.muted}>{left} left</Text> : null}
              </View>
            );
          })
        )}
      </View>

      {registration || event.ticket_limit ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking notes</Text>
          {registration ? <Text style={styles.muted}>Registration {registration}</Text> : null}
          {event.ticket_limit ? (
            <Text style={styles.muted}>Max {event.ticket_limit} tickets per order</Text>
          ) : null}
        </View>
      ) : null}

      {zones.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seating</Text>
          {zones.map((zone) => (
            <View key={zone.id} style={styles.rowCard}>
              <Text style={styles.rowTitle}>{zone.name}</Text>
              <Text style={styles.muted}>
                {[zone.type, zone.capacity ? `${zone.capacity} capacity` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>From</Text>
          <Text style={styles.footerPrice}>{price ?? "See tickets"}</Text>
        </View>
        <Button
          label="Get tickets"
          onPress={() =>
            router.push({ pathname: "/event/[id]/select", params: { id: event.id } })
          }
          style={styles.footerCta}
        />
      </View>
    </Screen>
  );
}

function isEventId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function BackButton() {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
      <Ionicons name="chevron-back" size={22} color={colors.foreground} />
      <Text style={styles.backLabel}>Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.section },
  back: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    marginLeft: -spacing.sm,
    marginBottom: spacing.md,
  },
  backLabel: { ...typography.body, color: colors.foreground },
  loading: { alignItems: "center", gap: spacing.md, paddingVertical: spacing.xxxl },
  errorBlock: { gap: spacing.md },
  cover: {
    height: 220,
    borderRadius: radii.xl,
    overflow: "hidden",
    backgroundColor: colors.surface,
    marginBottom: spacing.xl,
  },
  coverImage: { width: "100%", height: "100%" },
  coverFallback: { flex: 1, backgroundColor: colors.primaryMuted },
  badges: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    minHeight: 24,
    justifyContent: "center",
  },
  badgeFree: { backgroundColor: colors.accent },
  badgeText: { ...typography.caption, color: colors.white, fontWeight: "600" },
  category: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  title: { ...typography.display, color: colors.foreground },
  when: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm },
  muted: { ...typography.caption, color: colors.textSubtle, marginTop: spacing.xs },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.lg },
  tag: {
    borderRadius: radii.full,
    backgroundColor: colors.accentMuted,
    paddingHorizontal: spacing.md,
    minHeight: 28,
    justifyContent: "center",
  },
  tagText: { ...typography.caption, color: colors.accent, fontWeight: "600" },
  block: { marginTop: spacing.xl, gap: spacing.xs },
  blockLabel: { ...typography.caption, color: colors.textSubtle, fontWeight: "600" },
  blockValue: { ...typography.body, color: colors.foreground },
  org: { marginTop: spacing.xl, flexDirection: "row", alignItems: "center", gap: spacing.md },
  orgImage: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface },
  orgFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  orgInitial: { ...typography.title, color: colors.accent },
  orgCopy: { flex: 1, gap: 2 },
  description: { ...typography.body, color: colors.textMuted, marginTop: spacing.xl },
  section: { marginTop: spacing.xxl, gap: spacing.md },
  sectionTitle: { ...typography.title, color: colors.foreground },
  rowCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  rowTitle: { ...typography.body, fontWeight: "600", color: colors.foreground },
  ticketHead: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  price: {
    ...typography.body,
    fontWeight: "600",
    color: colors.foreground,
    fontVariant: ["tabular-nums"],
  },
  footer: {
    marginTop: spacing.xxxl,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  footerLabel: { ...typography.caption, color: colors.textSubtle },
  footerPrice: {
    ...typography.title,
    color: colors.foreground,
    fontVariant: ["tabular-nums"],
  },
  footerCta: { minWidth: 148 },
});
