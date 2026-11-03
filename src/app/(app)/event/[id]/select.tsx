import { useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { BookingStatus } from '@/features/booking/BookingStatus';
import { placeHold } from '@/features/booking/place-hold';
import { useBookableEvent } from '@/features/booking/useBookableEvent';
import { releaseHold } from '@/lib/api/bookings';
import { toErrorMessage } from '@/lib/api/errors';
import {
  availableSeatsForCategory,
  bookingDestination,
  pickedSeatsForCategory,
  quoteTicketCounts,
  seatedTickets,
  seatedZones,
  seatTargetsMet,
  standingRemaining,
  standingTickets,
  ticketLimit,
} from '@/lib/booking';
import { eventCoverUrl, formatEventWhen, formatMoney } from '@/lib/event-display';
import { useBooking } from '@/providers/booking';
import { BookingHeader } from '@/ui/booking';
import { Footer, PrimaryButton } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { QtyStepper } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';
import type { TicketCategory } from '@/types/event';

/** Mixed carts: standing quantities plus seats chosen on the seat map. */
export default function SelectTickets() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { event, error, loading, reload } = useBookableEvent(id);
  const { seatIds, seatQty, standing, hold, setHold, setSeatIds, setSeatQty, setStandingQty } = useBooking();
  const [notice, setNotice] = useState('');
  const [holding, setHolding] = useState(false);

  if (!event) {
    return <BookingStatus title="Select tickets" loading={loading} error={error} onRetry={() => void reload()} />;
  }

  const standingOffers = standingTickets(event);
  const seatedOffers = seatedTickets(event);
  const seated = seatedZones(event);
  const quote = quoteTicketCounts(event, seatQty, standing);
  const limit = ticketLimit(event);
  const cover = eventCoverUrl(event);
  const seatsReady = seatTargetsMet(event, seatIds, seatQty);
  const needsSeats = seatedOffers.some((ticket) => (seatQty[ticket.id] ?? 0) > 0);

  function changeStanding(ticket: TicketCategory, next: number) {
    const current = standing[ticket.id] ?? 0;
    const others = quote.count - current;
    const capped = Math.max(0, Math.min(next, standingRemaining(ticket), limit - others));
    setStandingQty(ticket.id, capped);
    setNotice(next > capped ? `You can take at most ${limit} tickets.` : '');
  }

  function changeSeatQty(ticket: TicketCategory, next: number) {
    const current = seatQty[ticket.id] ?? 0;
    const others = quote.count - current;
    const capped = Math.max(0, Math.min(next, availableSeatsForCategory(event!, ticket.id), limit - others));
    setSeatQty(ticket.id, capped);
    const picked = pickedSeatsForCategory(event!, seatIds, ticket.id);
    if (picked.length > capped) {
      const drop = new Set(picked.slice(capped).map((seat) => seat.id));
      setSeatIds(seatIds.filter((seatId) => !drop.has(seatId)));
    }
    setNotice(next > capped ? `You can take at most ${limit} tickets.` : '');
  }

  function openSeats() {
    const destination = seated.length > 1
      ? { pathname: '/event/[id]/section' as const, params: { id: event!.id } }
      : { pathname: '/event/[id]/seats' as const, params: { id: event!.id, zone: seated[0]?.id } };
    router.push(destination);
  }

  async function onContinue() {
    if (!quote.count || !seatsReady) {
      return;
    }
    setHolding(true);
    setNotice('');
    try {
      if (hold) {
        await releaseHold(hold.id).catch(() => undefined);
      }
      const next = await placeHold({ eventId: event!.id, seatIds, standing });
      setHold(next);
      router.push({ pathname: '/event/[id]/checkout', params: { id: event!.id } });
    } catch (caught) {
      setNotice(toErrorMessage(caught, 'Could not hold those tickets.'));
    } finally {
      setHolding(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <BookingHeader
        step={1}
        steps={seatedOffers.length ? undefined : ['1 · Tickets', '2 · Checkout']}
        thumb={cover ? { uri: cover } : undefined}
        title={event.name}
        subtitle={`${formatEventWhen(event.start, event.end)} · ${event.venue?.name ?? 'Venue to be announced'}`}
      />
      <ScrollView contentContainerStyle={{ paddingVertical: 22, paddingHorizontal: 20, gap: 14 }}>
        <Display style={{ marginBottom: 4 }}>Select <Hl>tickets.</Hl></Display>
        {notice ? <T accessibilityRole="alert" color={c.danger}>{notice}</T> : null}

        {seatedOffers.map((ticket) => {
          const qty = seatQty[ticket.id] ?? 0;
          const left = availableSeatsForCategory(event, ticket.id);
          const picked = pickedSeatsForCategory(event, seatIds, ticket.id);
          const zone = event.zones?.find((item) => item.id === ticket.zone_id)?.name;
          const soldOut = left <= 0;
          return (
            <TicketRow key={ticket.id} soldOut={soldOut} selected={qty > 0}>
              <View style={{ flex: 1, gap: 3 }}>
                <T w={800} s={15}>{ticket.name}</T>
                <T w={800} s={14} color={c.blue}>{event.is_free ? 'Free' : formatMoney(ticket.price)}</T>
                <T w={700} s={12} color={soldOut ? c.muted : c.ink2}>
                  {soldOut ? 'Sold out' : qty > 0 ? `${picked.length} of ${qty} seats picked${zone ? ` · ${zone}` : ''}` : `${left} seats${zone ? ` · ${zone}` : ''}`}
                </T>
              </View>
              {soldOut ? <SoldOut /> : (
                <QtyStepper qty={qty} label={ticket.name} onMinus={() => changeSeatQty(ticket, qty - 1)} onPlus={() => changeSeatQty(ticket, qty + 1)} />
              )}
            </TicketRow>
          );
        })}

        {standingOffers.map((ticket) => {
          const qty = standing[ticket.id] ?? 0;
          const left = standingRemaining(ticket);
          const soldOut = Number.isFinite(left) && left <= 0;
          return (
            <TicketRow key={ticket.id} soldOut={soldOut} selected={qty > 0}>
              <View style={{ flex: 1, gap: 3 }}>
                <T w={800} s={15}>{ticket.name}</T>
                <T w={800} s={14} color={c.blue}>{event.is_free ? 'Free' : formatMoney(ticket.price)}</T>
                <T w={700} s={12} color={soldOut ? c.muted : c.ink2}>{soldOut ? 'Sold out' : Number.isFinite(left) ? `${left} left` : 'On sale'}</T>
              </View>
              {soldOut ? <SoldOut /> : (
                <QtyStepper qty={qty} label={ticket.name} onMinus={() => changeStanding(ticket, qty - 1)} onPlus={() => changeStanding(ticket, qty + 1)} />
              )}
            </TicketRow>
          );
        })}

        {needsSeats ? (
          <PrimaryButton label={seatsReady ? 'Change seats' : 'Choose seats'} onPress={openSeats} />
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: c.blueSoft, borderRadius: 14 }}>
          <Icon name="info" size={18} color={c.blueDeep} />
          <T s={13} color={c.blueDeep} style={{ flex: 1 }}>Up to {limit} tickets per order. Seats are held for 10 minutes at checkout.</T>
        </View>
      </ScrollView>

      <Footer>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <T s={14} color={c.ink2}>{quote.summary || 'No tickets yet'}</T>
          <T w={800} s={20} ls={-0.02}>{formatMoney(String(quote.total)) ?? 'LKR 0'}</T>
        </View>
        <PrimaryButton
          label={holding ? 'Holding tickets…' : needsSeats && !seatsReady ? 'Choose seats first' : 'Continue to checkout'}
          disabled={!quote.count || holding || !seatsReady || !bookingDestination(event)}
          onPress={() => void onContinue()}
        />
      </Footer>
    </View>
  );
}

function TicketRow({ children, soldOut, selected }: { children: ReactNode; soldOut?: boolean; selected?: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 18,
        backgroundColor: soldOut ? c.field : c.white,
        borderWidth: !soldOut && selected ? 2 : 1,
        borderStyle: soldOut ? 'dashed' : 'solid',
        borderColor: soldOut ? c.dot : selected ? c.blue : c.line,
      }}
    >
      {children}
    </View>
  );
}

function SoldOut() {
  return (
    <View style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.segmentAlt, justifyContent: 'center' }}>
      <T w={800} s={12} color={c.muted}>Sold out</T>
    </View>
  );
}
