import type { PropsWithChildren } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { Event, EventVenue } from '@/types/event';
import { eventCoverUrl, lowestPriceLabel, mediaUrl } from '@/lib/event-display';
import { BackButton, PrimaryButton, Tap, useTopPad } from '@/ui/components';
import { Display, T } from '@/ui/Text';
import { c } from '@/ui/tokens';
import { dateLabel, venueAddress } from './model';

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: c.page },
  content: { paddingHorizontal: 20, paddingBottom: 30, gap: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  card: { backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, padding: 16, gap: 10 },
  section: { gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});

export function CatalogPage({ title, back = true, refresh, loading = false, children }: PropsWithChildren<{
  title: string; back?: boolean; refresh?: () => void; loading?: boolean;
}>) {
  const top = useTopPad();
  return <ScrollView style={styles.page} keyboardShouldPersistTaps="handled"
    refreshControl={refresh ? <RefreshControl refreshing={loading} onRefresh={refresh} /> : undefined}
    contentContainerStyle={[styles.content, { paddingTop: top }]}>
    <StatusBar style="dark" />
    <View style={styles.row}>{back ? <BackButton /> : null}<Display size={28} style={{ flex: 1 }}>{title}</Display></View>
    {children}
  </ScrollView>;
}

export function ResourceState({ loading, error, retry, empty, emptyText = 'Nothing here yet.' }: {
  loading: boolean; error?: string; retry: () => void; empty?: boolean; emptyText?: string;
}) {
  if (loading) return <View style={styles.card}><ActivityIndicator color={c.blue} /><T align="center">Loading…</T></View>;
  if (error) return <View style={styles.card}><T accessibilityRole="alert" color={c.danger}>{error}</T><PrimaryButton label="Try again" onPress={retry} /></View>;
  if (empty) return <View style={styles.card}><T color={c.muted}>{emptyText}</T></View>;
  return null;
}

/** Missing artwork stays neutral instead of showing an unrelated sample photo. */
export function CatalogImage({ url, height = 160, label }: { url?: string | null; height?: number; label: string }) {
  return <View style={{ height, backgroundColor: c.ink, borderRadius: 14, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
    {url ? <Image source={{ uri: url }} accessibilityLabel={label} contentFit="cover" style={{ width: '100%', height: '100%' }} /> : <T color={c.onDarkMuted}>{label}</T>}
  </View>;
}

export function EventCard({ event, hero = false }: { event: Event; hero?: boolean }) {
  return <Tap accessibilityRole="button" accessibilityLabel={event.name}
    onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
    style={{ ...styles.card, ...(hero ? { width: 300 } : {}) }}>
    <CatalogImage url={eventCoverUrl(event)} label={event.name} height={hero ? 210 : 140} />
    <T w={700} s={12} color={c.blue}>{dateLabel(event.start)}</T>
    <T w={800} s={18}>{event.name}</T>
    {event.venue ? <T s={13} color={c.muted}>{event.venue.name}{venueAddress(event.venue) ? ` · ${venueAddress(event.venue)}` : ''}</T> : null}
    {event.category ? <T s={12} color={c.muted}>{event.category.name}</T> : null}
    <T w={800} color={c.blue}>{lowestPriceLabel(event) ?? 'Pricing to be announced'}</T>
  </Tap>;
}

export function VenueCard({ venue }: { venue: EventVenue }) {
  return <Tap accessibilityRole="button" accessibilityLabel={venue.name} style={styles.card}
    onPress={() => router.push({ pathname: '/explore/venue/[id]', params: { id: venue.id } })}>
    <CatalogImage url={mediaUrl(venue.images?.[0])} label={venue.name} height={130} />
    <T w={800} s={17}>{venue.name}</T>
    <T color={c.muted}>{venueAddress(venue) || 'Location to be announced'}</T>
  </Tap>;
}
