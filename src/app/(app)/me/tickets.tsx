import { useCallback, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';

import { loadTicketOrders, type TicketOrder } from '@/features/tickets/load';
import { categoryPills, daysUntilLabel, isUpcomingOrder, orderStatusLabel, orderWhen, pricePill, seatPill } from '@/features/tickets/present';
import { toErrorMessage } from '@/lib/api/errors';
import { useSession } from '@/providers/session';
import { PrimaryButton, Segmented, Tap } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { SettingsScreen } from '@/ui/settings';
import { SkeletonStack } from '@/ui/skeleton';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';
import type { Order } from '@/types/booking';

function Pill({ label, soft }: { label: string; soft?: boolean }) {
  return (
    <View style={{ height: 28, paddingHorizontal: 10, borderRadius: 999, backgroundColor: soft ? c.blueSoft : c.page, justifyContent: 'center' }}>
      <T w={soft ? 800 : 700} s={12} color={soft ? c.blueDeep : c.ink}>{label}</T>
    </View>
  );
}

function StatusPill({ order }: { order: Order }) {
  const status = orderStatusLabel(order.status);
  const color = status.tone === 'success' ? c.success : status.tone === 'danger' ? c.error : c.blueDeep;
  const background = status.tone === 'success' ? c.white : status.tone === 'danger' ? c.white : c.white;
  return (
    <View style={{ height: 28, paddingHorizontal: 10, borderRadius: 999, backgroundColor: background, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {status.tone === 'success' ? <Icon name="check" size={13} color={color} stroke={3} /> : null}
      <T w={800} s={12} color={color}>{status.label}</T>
    </View>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 24, paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center', gap: 12 }}>
      <View style={{ width: 72, height: 72, borderRadius: 999, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="ticket" size={30} color={c.blue} />
      </View>
      <T w={800} s={17}>{title}</T>
      <T s={14} lh={1.5} color={c.ink2} align="center">{body}</T>
      <Tap accessibilityRole="link" onPress={() => router.navigate('/')} style={{ marginTop: 4 }}>
        <T w={800} s={15} color={c.blue}>Browse events →</T>
      </Tap>
    </View>
  );
}

function openOrder(order: Order) {
  if (order.status === 'PENDING_PAYMENT') {
    router.push({ pathname: '/order/[id]', params: { id: order.id } });
    return;
  }
  router.push({ pathname: '/me/booking/[id]', params: { id: order.id } });
}

function HeroCard({ item }: { item: TicketOrder }) {
  const { order, cover, venueName, venueId } = item;
  const when = daysUntilLabel(order.event?.start);
  return (
    <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, overflow: 'hidden' }}>
      <View style={{ height: 120, backgroundColor: c.blueSoft }}>
        {cover ? <Image source={{ uri: cover }} style={{ width: '100%', height: '100%' }} contentFit="cover" /> : null}
        <View style={{ position: 'absolute', top: 12, left: 12 }}>
          <StatusPill order={order} />
        </View>
        {when ? (
          <View style={{ position: 'absolute', top: 12, right: 12, height: 28, paddingHorizontal: 10, borderRadius: 999, backgroundColor: 'rgba(10,17,48,0.72)', justifyContent: 'center' }}>
            <T w={700} s={12} color={c.white}>{when}</T>
          </View>
        ) : null}
      </View>
      <View style={{ paddingTop: 14, paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
        <View style={{ gap: 3 }}>
          <T w={800} s={17} ls={-0.01}>{order.event?.name ?? 'Event'}</T>
          <T s={13} color={c.muted}>{orderWhen(order, venueName)}</T>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {categoryPills(order).map((label) => <Pill key={label} label={label} soft />)}
          <Pill label={seatPill(order)} />
          <Pill label={pricePill(order)} />
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Tap accessibilityRole="button" onPress={() => openOrder(order)} style={{ flex: 1, height: 44, borderRadius: 999, backgroundColor: c.blue, alignItems: 'center', justifyContent: 'center' }}>
            <T w={800} s={14} color={c.white}>{order.status === 'PENDING_PAYMENT' ? 'Finish payment' : 'View tickets'}</T>
          </Tap>
          {venueId ? (
            <Tap accessibilityRole="button" onPress={() => router.push({ pathname: '/explore/venue/[id]', params: { id: venueId } })} style={{ flex: 1, height: 46, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
              <T w={700} s={14}>Venue & directions</T>
            </Tap>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function CompactCard({ item }: { item: TicketOrder }) {
  const { order, cover, venueName } = item;
  const summary = [...categoryPills(order), seatPill(order)].join(' · ');
  return (
    <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {cover ? (
        <Image source={{ uri: cover }} style={{ width: 84, height: 84, borderRadius: 14 }} contentFit="cover" />
      ) : (
        <View style={{ width: 84, height: 84, borderRadius: 14, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="ticket" size={24} color={c.blue} />
        </View>
      )}
      <View style={{ flex: 1, gap: 4 }}>
        <T w={800} s={12} color={c.blue}>{orderWhen(order, venueName)}</T>
        <T w={800} s={15}>{order.event?.name ?? 'Event'}</T>
        <T s={12} color={c.muted}>{summary}</T>
      </View>
      <Tap accessibilityRole="button" accessibilityLabel={`View tickets for ${order.event?.name ?? 'this event'}`} onPress={() => openOrder(order)} style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="chevronRight" size={18} color={c.blue} stroke={2.2} />
      </Tap>
    </View>
  );
}

/** E3 My tickets & bookings. */
export default function MyTickets() {
  const { session } = useSession();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [items, setItems] = useState<TicketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (silent = false) => {
    if (!session) {
      setItems([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    if (!silent) {
      setLoading(true);
    }
    try {
      setItems(await loadTicketOrders());
      setError('');
    } catch (caught) {
      setError(toErrorMessage(caught, 'Could not load your tickets.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session]);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  const upcoming = items.filter((item) => isUpcomingOrder(item.order));
  const past = items.filter((item) => !isUpcomingOrder(item.order));
  const visible = tab === 'upcoming' ? upcoming : past;
  const upcomingLabel = `Upcoming (${upcoming.length})`;

  return (
    <SettingsScreen
      refreshControl={(
        <RefreshControl
          tintColor={c.blue}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            void load(true);
          }}
        />
      )}
    >
      <View style={{ gap: 8 }}>
        <Display>My <Hl>tickets.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>Orders placed through SeatSnaps.</T>
      </View>

      {!session ? (
        <View style={{ gap: 14 }}>
          <Empty title="Sign in to see your tickets" body="Tickets from your account show up here after you book." />
          <PrimaryButton label="Sign in" onPress={() => router.push('/login')} />
        </View>
      ) : (
        <>
          <Segmented options={[upcomingLabel, 'Past']} value={tab === 'upcoming' ? upcomingLabel : 'Past'} onChange={(value) => setTab(value === 'Past' ? 'past' : 'upcoming')} />
          {loading && items.length === 0 ? <SkeletonStack count={2} height={168} radius={22} /> : null}
          {error ? (
            <View style={{ gap: 12 }}>
              <T accessibilityRole="alert" color={c.danger}>{error}</T>
              <PrimaryButton label="Try again" onPress={() => void load()} />
            </View>
          ) : null}
          {!loading && !error && visible.length === 0 ? (
            <Empty
              title={tab === 'upcoming' ? 'No upcoming tickets' : 'No past events yet'}
              body={tab === 'upcoming' ? 'Book a show and your tickets will land here.' : "Events you've attended will show up here."}
            />
          ) : (
            <View style={{ gap: 14 }}>
              {visible.map((item, index) => index === 0
                ? <HeroCard key={item.order.id} item={item} />
                : <CompactCard key={item.order.id} item={item} />)}
            </View>
          )}
        </>
      )}
    </SettingsScreen>
  );
}
