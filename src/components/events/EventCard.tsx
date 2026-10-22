import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

import { eventCoverUrl, formatEventWhen, lowestPriceLabel } from "@/lib/event-display";
import { colors, radii, spacing, typography } from "@/theme";
import type { Event } from "@/types/event";

type EventCardProps = {
  event: Event;
  compact?: boolean;
};

export function EventCard({ event, compact = false }: EventCardProps) {
  const cover = eventCoverUrl(event);
  const price = lowestPriceLabel(event);
  const location = [event.venue?.name, event.venue?.city].filter(Boolean).join(" · ");

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.push({
          pathname: "/event/[id]",
          params: { id: event.id },
        })
      }
      style={[styles.card, compact && styles.compact]}
    >
      <View style={[styles.poster, compact && styles.posterCompact]}>
        {cover ? (
          <Image source={{ uri: cover }} style={styles.image} contentFit="cover" transition={200} />
        ) : (
          <View style={styles.fallback} />
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
      <View style={styles.body}>
        {event.category?.name ? (
          <Text style={styles.category}>{event.category.name}</Text>
        ) : null}
        <Text style={styles.title} numberOfLines={2}>
          {event.name}
        </Text>
        <Text style={styles.meta}>{formatEventWhen(event.start, event.end)}</Text>
        {location ? (
          <Text style={styles.meta} numberOfLines={1}>
            {location}
          </Text>
        ) : null}
        {price ? <Text style={styles.price}>{price}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  compact: {
    width: 260,
  },
  poster: {
    height: 168,
    backgroundColor: colors.surfaceAlt,
  },
  posterCompact: {
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    flex: 1,
    backgroundColor: colors.primaryMuted,
  },
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
  badgeFree: {
    backgroundColor: colors.accent,
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
  body: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  category: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  title: {
    ...typography.title,
    color: colors.foreground,
  },
  meta: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  price: {
    ...typography.body,
    fontWeight: "600",
    color: colors.foreground,
    fontVariant: ["tabular-nums"],
    marginTop: spacing.xs,
  },
});
