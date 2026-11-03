import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { SeatMap } from '@/components/booking/SeatMap';
import { BookingStatus } from '@/features/booking/BookingStatus';
import { useBookableEvent } from '@/features/booking/useBookableEvent';
import { groupSeatsByRow, isCanvasZone, pickedSeatsForCategory, quoteSelection, seatedZones, ticketLimit } from '@/lib/booking';
import { formatMoney } from '@/lib/event-display';
import { useBooking } from '@/providers/booking';
import { BookingHeader } from '@/ui/booking';
import { Footer, PrimaryButton } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';
import type { EventSeat } from '@/types/event';

const GAP = 5;

function Legend({ swatch, label }: { swatch: object; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 14, height: 14, borderRadius: 5, ...swatch }} />
      <T s={12} color={c.ink2}>{label}</T>
    </View>
  );
}

/** Seat map for one zone. Returns to the tickets step so checkout starts there. */
export default function PickSeats() {
  const { id = '', zone: zoneParam = '' } = useLocalSearchParams<{ id: string; zone?: string }>();
  const { event, error, loading, reload } = useBookableEvent(id);
  const { seatIds, seatQty, standing, setSeatIds } = useBooking();
  const [notice, setNotice] = useState('');

  if (!event) {
    return <BookingStatus title="Pick seats" loading={loading} error={error} onRetry={() => void reload()} />;
  }

  const zones = seatedZones(event);
  const zone = zones.find((item) => item.id === zoneParam) ?? (zones.length === 1 ? zones[0] : undefined);
  if (!zone) {
    return (
      <BookingStatus
        title="Pick seats"
        error="Choose a section first."
        retryLabel="Choose a section"
        onRetry={() => router.replace({ pathname: '/event/[id]/section', params: { id: event.id } })}
      />
    );
  }

  const quote = quoteSelection(event, seatIds, standing);
  const limit = ticketLimit(event);
  const rows = groupSeatsByRow(zone.seats ?? []);
  const selected = zones.flatMap((item) => item.seats ?? []).filter((seat) => seatIds.includes(seat.id));

  function quotaFor(seat: EventSeat) {
    return seat.ticket_category_id ? seatQty[seat.ticket_category_id] ?? 0 : 0;
  }

  function toggle(seat: EventSeat) {
    if (seatIds.includes(seat.id)) {
      setSeatIds(seatIds.filter((value) => value !== seat.id));
      setNotice('');
      return;
    }
    if (seat.status !== 'AVAILABLE') {
      return;
    }
    const quota = quotaFor(seat);
    if (quota <= 0) {
      setNotice('Set a ticket count on the tickets step before choosing this seat.');
      return;
    }
    const picked = pickedSeatsForCategory(event!, seatIds, seat.ticket_category_id!).length;
    if (picked >= quota) {
      const name = event!.ticket_categories?.find((ticket) => ticket.id === seat.ticket_category_id)?.name ?? 'this ticket';
      setNotice(`You already picked ${quota} ${name}.`);
      return;
    }
    if (quote.count >= limit) {
      setNotice(`You can take at most ${limit} tickets.`);
      return;
    }
    setSeatIds([...seatIds, seat.id]);
    setNotice('');
  }

  function backToTickets() {
    router.dismissTo({ pathname: '/event/[id]/select', params: { id: event!.id } });
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <BookingHeader step={2} title={zone.name} subtitle={`${event.name} · up to ${limit} tickets`} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Display>Pick your <Hl>seats.</Hl></Display>
        {notice ? <T accessibilityRole="alert" color={c.danger}>{notice}</T> : null}

        {isCanvasZone(zone) ? (
          <SeatMap zone={zone} layout={event.layout} selectedIds={seatIds} onToggle={toggle} />
        ) : (
          <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, paddingVertical: 18, paddingHorizontal: 10, gap: 8 }}>
            <View style={{ alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <View style={{ width: 200, height: 6, borderBottomLeftRadius: 999, borderBottomRightRadius: 999, backgroundColor: c.ink }} />
              <T w={800} s={10} ls={0.2} color={c.muted}>STAGE THIS WAY</T>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ gap: 6 }}>
                {rows.map(([row, rowSeats]) => (
                  <View key={row} style={{ flexDirection: 'row', alignItems: 'center', gap: GAP }}>
                    <T w={800} s={11} color={c.muted} align="center" style={{ width: 28 }}>{row}</T>
                    {rowSeats.map((seat) => {
                      const taken = seat.status !== 'AVAILABLE';
                      const mine = seatIds.includes(seat.id);
                      return (
                        <Pressable
                          key={seat.id}
                          disabled={taken}
                          onPress={() => toggle(seat)}
                          accessibilityRole="button"
                          accessibilityState={{ disabled: taken, selected: mine }}
                          accessibilityLabel={`Seat ${seat.code}${taken ? ', taken' : mine ? ', selected' : ''}`}
                          style={{
                            width: 28,
                            height: 26,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: taken ? c.dot : mine ? c.blue : c.white,
                            borderWidth: taken || mine ? 0 : 1.5,
                            borderColor: c.seatLine,
                          }}
                        >
                          {taken ? null : <T w={800} s={9} color={mine ? c.white : c.subtle}>{seat.column ?? seat.code}</T>}
                        </Pressable>
                      );
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18 }}>
          <Legend swatch={{ backgroundColor: c.white, borderWidth: 1.5, borderColor: c.seatLine }} label="Available" />
          <Legend swatch={{ backgroundColor: c.blue }} label="Yours" />
          <Legend swatch={{ backgroundColor: c.dot }} label="Taken" />
        </View>
      </ScrollView>

      <Footer>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {selected.length ? selected.map((seat) => (
              <View key={seat.id} style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.blueSoft, justifyContent: 'center' }}>
                <T w={800} s={13} color={c.blueDeep}>Seat {seat.code}</T>
              </View>
            )) : <T s={14} color={c.muted}>Tap the seats you want</T>}
          </View>
          <T w={800} s={20} ls={-0.02}>{formatMoney(String(quote.total)) ?? 'LKR 0'}</T>
        </View>
        <PrimaryButton
          label="Back to tickets"
          onPress={backToTickets}
        />
      </Footer>
    </View>
  );
}
