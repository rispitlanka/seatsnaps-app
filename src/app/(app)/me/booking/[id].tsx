import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { bookedLabel, orderStatusLabel, orderWhen, paymentLines } from '@/features/tickets/present';
import { getOrder } from '@/lib/api/bookings';
import { getEventById } from '@/lib/api/events';
import { toErrorMessage } from '@/lib/api/errors';
import { eventCoverUrl, formatMoney, parseMoney } from '@/lib/event-display';
import { Eyebrow, PrimaryButton, Tap, TextButton } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { ListCard, SettingsScreen } from '@/ui/settings';
import { SkeletonStack } from '@/ui/skeleton';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';
import type { Order, OrderTicket } from '@/types/booking';

function SeatTile({ seat }: { seat: string }) {
  return (
    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: c.blue, alignItems: 'center', justifyContent: 'center' }}>
      <T w={800} s={seat.length > 3 ? 11 : 14} color={c.white}>{seat}</T>
    </View>
  );
}

function Line({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <T w={bold ? 800 : 400} s={14} color={bold ? c.ink : c.ink2} style={{ flex: 1 }}>{label}</T>
      <T w={bold ? 800 : 700} s={14}>{value}</T>
    </View>
  );
}

function ticketLabel(ticket: OrderTicket) {
  return ticket.seat?.code ?? 'GA';
}

/** J1 Booking detail. */
export default function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [venueName, setVenueName] = useState<string | null>(null);
  const [venueId, setVenueId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      const next = await getOrder(id);
      setOrder(next);
      let nextCover = next.event ? eventCoverUrl(next.event) : null;
      let nextVenue = next.event?.venue ?? null;
      if (!nextCover || !nextVenue?.name) {
        try {
          const event = await getEventById(next.event_id);
          nextCover = nextCover ?? eventCoverUrl(event);
          nextVenue = nextVenue ?? event.venue ?? null;
        } catch {
          // The order still renders without the public event page.
        }
      }
      setCover(nextCover);
      setVenueName(nextVenue?.name ?? null);
      setVenueId(nextVenue?.id ?? null);
      setError('');
    } catch (caught) {
      setError(toErrorMessage(caught, 'Could not load this booking.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  if (loading && !order) {
    return (
      <SettingsScreen>
        <SkeletonStack count={3} height={96} radius={20} />
      </SettingsScreen>
    );
  }

  if (!order) {
    return (
      <SettingsScreen>
        <Display>Your <Hl>booking.</Hl></Display>
        <T accessibilityRole="alert" color={c.danger}>{error || 'This booking could not be found.'}</T>
        <PrimaryButton label="Try again" onPress={() => void load()} />
      </SettingsScreen>
    );
  }

  const status = orderStatusLabel(order.status);
  const statusColor = status.tone === 'success' ? c.success : status.tone === 'danger' ? c.error : c.blueDeep;
  const tickets = order.tickets ?? [];
  const lines = paymentLines(order);
  const discount = parseMoney(order.discount_total) ?? 0;
  const booked = bookedLabel(order.created_at);
  const total = order.event?.is_free ? 'Free' : formatMoney(order.total) ?? 'Free';

  return (
    <SettingsScreen>
      <View style={{ gap: 8 }}>
        <View style={{ alignSelf: 'flex-start', height: 28, paddingHorizontal: 10, borderRadius: 999, backgroundColor: status.tone === 'success' ? c.successSoft : c.blueSoft, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {status.tone === 'success' ? <Icon name="check" size={13} color={statusColor} stroke={3} /> : null}
          <T w={800} s={12} color={statusColor}>{status.label}</T>
        </View>
        <Display>Your <Hl>booking.</Hl></Display>
        <T s={13} color={c.muted}>
          {order.order_number ? `Order ${order.order_number}` : 'Order'}
          {booked ? ` · booked ${booked}` : ''}
        </T>
      </View>

      <Tap accessibilityRole="button" accessibilityLabel={order.event?.name ?? 'Event'} onPress={() => router.push({ pathname: '/event/[id]', params: { id: order.event?.slug ?? order.event_id } })} style={{ flexDirection: 'row', gap: 12, padding: 8, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20 }}>
        {cover ? (
          <Image source={{ uri: cover }} style={{ width: 84, height: 84, borderRadius: 14 }} contentFit="cover" />
        ) : (
          <View style={{ width: 84, height: 84, borderRadius: 14, backgroundColor: c.blueSoft }} />
        )}
        <View style={{ flex: 1, gap: 3, paddingVertical: 4 }}>
          <T w={800} s={16}>{order.event?.name ?? 'Event'}</T>
          <T s={12} color={c.muted}>{orderWhen(order, venueName)}</T>
        </View>
      </Tap>

      <View style={{ gap: 10 }}>
        <Eyebrow>TICKETS · {Math.max(tickets.length, order.items?.length ?? 0)}</Eyebrow>
        <ListCard>
          {(tickets.length ? tickets : []).map((ticket, index) => (
            <View key={ticket.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: index === tickets.length - 1 ? 0 : 1, borderBottomColor: c.lineSoft }}>
              <SeatTile seat={ticketLabel(ticket)} />
              <View style={{ flex: 1, gap: 2 }}>
                <T w={800} s={15}>{ticket.ticket_category?.name ?? 'Ticket'} · {ticket.reference_id}</T>
                <T s={12} color={c.muted}>{ticket.check_in ? 'Checked in' : order.buyer_name || 'Yours'}</T>
              </View>
              {order.status === 'PAID' ? (
                <Tap accessibilityRole="button" onPress={() => router.push({ pathname: '/me/booking/gate', params: { orderId: order.id, ticketId: ticket.id } })} style={{ height: 36, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center', backgroundColor: c.ink }}>
                  <T w={800} s={13} color={c.white}>Show QR</T>
                </Tap>
              ) : null}
            </View>
          ))}
          {tickets.length === 0 ? (
            <View style={{ paddingVertical: 12 }}>
              <T s={14} color={c.ink2}>Tickets appear here once the order is confirmed.</T>
            </View>
          ) : null}
        </ListCard>
      </View>

      <View style={{ gap: 10 }}>
        <Eyebrow>PAYMENT</Eyebrow>
        <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, gap: 10 }}>
          {lines.map((line) => <Line key={line.label} label={line.label} value={line.value} />)}
          {discount > 0 ? <Line label={order.promo_code ? `Promo · ${order.promo_code}` : 'Discount'} value={`− ${formatMoney(order.discount_total)}`} /> : null}
          <View style={{ paddingTop: 10, borderTopWidth: 1, borderTopColor: c.lineSoft }}>
            <Line label={order.status === 'PAID' ? 'Paid' : 'Total'} value={total} bold />
          </View>
        </View>
      </View>

      {order.status === 'PENDING_PAYMENT' ? (
        <PrimaryButton label="Finish payment" onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })} />
      ) : null}

      {venueId ? (
        <Tap accessibilityRole="button" onPress={() => router.push({ pathname: '/explore/venue/[id]', params: { id: venueId } })} style={{ height: 50, borderRadius: 999, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
          <T w={700} s={14}>Directions</T>
        </Tap>
      ) : null}
      <TextButton label="Get help with this booking" color={c.blue} s={14} height={40} onPress={() => router.push('/contact')} />
    </SettingsScreen>
  );
}
