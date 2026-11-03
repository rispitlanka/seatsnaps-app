import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { BookingStatus } from '@/features/booking/BookingStatus';
import { placeHold } from '@/features/booking/place-hold';
import { useBookableEvent } from '@/features/booking/useBookableEvent';
import { releaseHold } from '@/lib/api/bookings';
import { toErrorMessage } from '@/lib/api/errors';
import { quoteSelection, standingRemaining, standingTickets, ticketLimit } from '@/lib/booking';
import { eventCoverUrl, formatEventWhen, formatMoney } from '@/lib/event-display';
import { useBooking } from '@/providers/booking';
import { BookingHeader } from '@/ui/booking';
import { Footer, PrimaryButton } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { QtyStepper } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';
import type { TicketCategory } from '@/types/event';

/** General admission: quantities only, then a hold. */
export default function GeneralAdmission() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { event, error, loading, reload } = useBookableEvent(id);
  const { standing, hold, setHold, setStandingQty } = useBooking();
  const [notice, setNotice] = useState('');
  const [holding, setHolding] = useState(false);

  if (!event) {
    return <BookingStatus title="Select tickets" loading={loading} error={error} onRetry={() => void reload()} />;
  }

  const offers = standingTickets(event);
  const quote = quoteSelection(event, [], standing);
  const limit = ticketLimit(event);
  const cover = eventCoverUrl(event);

  function changeQty(ticket: TicketCategory, next: number) {
    const current = standing[ticket.id] ?? 0;
    const others = quote.count - current;
    const capped = Math.max(0, Math.min(next, standingRemaining(ticket), limit - others));
    setStandingQty(ticket.id, capped);
    setNotice(next > capped ? `You can take at most ${limit} tickets.` : '');
  }

  async function onContinue() {
    if (!quote.count) {
      return;
    }
    setHolding(true);
    setNotice('');
    try {
      if (hold) {
        await releaseHold(hold.id).catch(() => undefined);
      }
      const next = await placeHold({ eventId: event!.id, seatIds: [], standing });
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
        steps={['1 · Tickets', '2 · Checkout']}
        thumb={cover ? { uri: cover } : undefined}
        title={event.name}
        subtitle={formatEventWhen(event.start, event.end)}
      />
      <ScrollView contentContainerStyle={{ paddingVertical: 22, paddingHorizontal: 20, gap: 14 }}>
        <Display style={{ marginBottom: 4 }}>Select <Hl>tickets.</Hl></Display>
        {notice ? <T accessibilityRole="alert" color={c.danger}>{notice}</T> : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 14 }}>
          <Icon name="users" size={18} color={c.blue} />
          <T s={13} color={c.ink2} style={{ flex: 1 }}>General admission — no assigned seats.</T>
        </View>
        {offers.map((ticket) => {
          const qty = standing[ticket.id] ?? 0;
          const left = standingRemaining(ticket);
          const soldOut = Number.isFinite(left) && left <= 0;
          return (
            <View
              key={ticket.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 14,
                borderRadius: 18,
                backgroundColor: soldOut ? c.field : c.white,
                borderWidth: !soldOut && qty ? 2 : 1,
                borderStyle: soldOut ? 'dashed' : 'solid',
                borderColor: soldOut ? c.dot : qty ? c.blue : c.line,
              }}
            >
              <View style={{ flex: 1, gap: 3 }}>
                <T w={800} s={15}>{ticket.name}</T>
                <T s={12} color={c.muted}>{soldOut ? 'None left' : Number.isFinite(left) ? `${left} left` : 'On sale'}</T>
                <T w={800} s={14} color={c.blue}>{event.is_free ? 'Free' : formatMoney(ticket.price)}</T>
              </View>
              {soldOut ? (
                <View style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.segmentAlt, justifyContent: 'center' }}>
                  <T w={800} s={12} color={c.muted}>Sold out</T>
                </View>
              ) : (
                <QtyStepper qty={qty} label={ticket.name} onMinus={() => changeQty(ticket, qty - 1)} onPlus={() => changeQty(ticket, qty + 1)} />
              )}
            </View>
          );
        })}
      </ScrollView>
      <Footer>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <T s={14} color={c.ink2}>{quote.summary || 'No tickets yet'}</T>
          <T w={800} s={20} ls={-0.02}>{formatMoney(String(quote.total)) ?? 'LKR 0'}</T>
        </View>
        <PrimaryButton label={holding ? 'Holding tickets…' : 'Continue to checkout'} disabled={!quote.count || holding} onPress={() => void onContinue()} />
      </Footer>
    </View>
  );
}
