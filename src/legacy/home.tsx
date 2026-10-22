import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { EventCard } from "@/components/events/EventCard";
import { FilterChip } from "@/components/events/FilterChip";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import {
  listCities,
  listEventCategories,
  listEventTags,
  listEventVenues,
  listEvents,
} from "@/lib/api/events";
import { toErrorMessage } from "@/lib/api/errors";
import { useSession } from "@/providers/session";
import { colors, radii, spacing, typography } from "@/theme";
import type { City, Event, EventCategory, EventTag, EventVenue } from "@/types/event";

function filterEvents(
  events: Event[],
  query: string,
  categoryId: string,
  cityId: string,
  tagId: string,
  venueId: string,
) {
  const needle = query.trim().toLowerCase();
  return events
    .filter((event) => {
      if (categoryId !== "all" && event.category?.id !== categoryId && event.category_id !== categoryId) {
        return false;
      }
      if (cityId !== "all" && event.venue?.city_id !== cityId) {
        return false;
      }
      if (venueId !== "all" && event.venue?.id !== venueId && event.venue_id !== venueId) {
        return false;
      }
      if (tagId !== "all" && !(event.tags ?? []).some((tag) => tag.id === tagId)) {
        return false;
      }
      if (!needle) {
        return true;
      }
      const haystack = [
        event.name,
        event.venue?.name,
        event.venue?.city,
        event.category?.name,
        ...(event.tags ?? []).map((tag) => tag.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export default function HomeScreen() {
  const { user } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [tags, setTags] = useState<EventTag[]>([]);
  const [venues, setVenues] = useState<EventVenue[]>([]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [cityId, setCityId] = useState("all");
  const [tagId, setTagId] = useState("all");
  const [venueId, setVenueId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    try {
      const [nextEvents, nextCategories, nextCities, nextTags, nextVenues] = await Promise.all([
        listEvents(),
        listEventCategories(),
        listCities(),
        listEventTags(),
        listEventVenues(),
      ]);
      setEvents(nextEvents);
      setCategories(nextCategories);
      setCities(nextCities);
      setTags(nextTags);
      setVenues(nextVenues);
    } catch (caught) {
      setError(toErrorMessage(caught, "Could not load shows."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleVenues = useMemo(
    () => (cityId === "all" ? venues : venues.filter((venue) => venue.city_id === cityId)),
    [cityId, venues],
  );

  const filtered = useMemo(
    () => filterEvents(events, query, categoryId, cityId, tagId, venueId),
    [events, query, categoryId, cityId, tagId, venueId],
  );
  const featured = filtered.filter((event) => event.is_featured);
  const firstName = user?.firstName?.trim();

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
      <Text style={styles.kicker}>SeatSnaps</Text>
      <Text style={styles.title}>{firstName ? `Hey ${firstName}` : "Find your seat"}</Text>
      <Text style={styles.subtitle}>Events, movies, and experiences near you.</Text>

      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.textSubtle} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search shows and venues"
          placeholderTextColor={colors.textSubtle}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          style={styles.searchInput}
        />
      </View>

      {error ? (
        <View style={styles.errorBlock}>
          <Banner message={error} />
          <Button label="Try again" onPress={() => void load()} />
        </View>
      ) : null}

      <ChipScroller>
        <FilterChip label="All" active={categoryId === "all"} onPress={() => setCategoryId("all")} />
        {categories.map((category) => (
          <FilterChip
            key={category.id}
            label={category.name}
            active={categoryId === category.id}
            onPress={() => setCategoryId(category.id)}
          />
        ))}
      </ChipScroller>

      <ChipScroller>
        <FilterChip
          label="All cities"
          active={cityId === "all"}
          onPress={() => {
            setCityId("all");
            setVenueId("all");
          }}
        />
        {cities.map((city) => (
          <FilterChip
            key={city.id}
            label={city.name}
            active={cityId === city.id}
            onPress={() => {
              setCityId(city.id);
              setVenueId("all");
            }}
          />
        ))}
      </ChipScroller>

      {visibleVenues.length > 0 ? (
        <ChipScroller>
          <FilterChip label="All venues" active={venueId === "all"} onPress={() => setVenueId("all")} />
          {visibleVenues.map((venue) => (
            <FilterChip
              key={venue.id}
              label={venue.name}
              active={venueId === venue.id}
              onPress={() => setVenueId(venue.id)}
            />
          ))}
        </ChipScroller>
      ) : null}

      <ChipScroller>
        <FilterChip label="All tags" active={tagId === "all"} onPress={() => setTagId("all")} />
        {tags.map((tag) => (
          <FilterChip
            key={tag.id}
            label={tag.name}
            active={tagId === tag.id}
            onPress={() => setTagId(tag.id)}
          />
        ))}
      </ChipScroller>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.loadingText}>Finding shows…</Text>
        </View>
      ) : (
        <View style={styles.feed}>
          {featured.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Featured</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRow}>
                {featured.map((event) => (
                  <EventCard key={event.id} event={event} compact />
                ))}
              </ScrollView>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>This season</Text>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No shows match that filter</Text>
              <Text style={styles.emptyBody}>
                Try another city, category, or search. New listings appear here as soon as they go live.
              </Text>
            </View>
          ) : (
            filtered.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </View>
      )}
    </Screen>
  );
}

function ChipScroller({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chips}
      style={styles.chipRow}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.display,
    color: colors.foreground,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSubtle,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    maxWidth: 320,
  },
  search: {
    minHeight: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  searchInput: {
    ...typography.body,
    color: colors.foreground,
    flex: 1,
    paddingVertical: spacing.md,
  },
  chipRow: {
    marginBottom: spacing.md,
    flexGrow: 0,
  },
  chips: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  errorBlock: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  loading: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xxxl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSubtle,
  },
  feed: {
    gap: spacing.lg,
    paddingTop: spacing.md,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.foreground,
  },
  featuredRow: {
    gap: spacing.lg,
    paddingRight: spacing.lg,
  },
  empty: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    ...typography.title,
    color: colors.foreground,
  },
  emptyBody: {
    ...typography.body,
    color: colors.textSubtle,
  },
});
