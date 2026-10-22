import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { event, lkr, seatRows, takenSeats, tiers } from '@/mocks/catalog';
import { useCart } from '@/providers/cart';
import { BookingHeader } from '@/ui/booking';
import { Footer, PrimaryButton } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const GAP = 5;

function Legend({ swatch, label }: { swatch: object; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 14, height: 14, borderRadius: 5, ...swatch }} />
      <T s={12} color={c.ink2}>{label}</T>
    </View>
  );
}

/** D4 Pick seats. */
export default function PickSeats() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cart = useCart();
  const need = cart.count || 2;
  const picked = cart.seats;
  const price = tiers.find(t => t.name === cart.tier)?.price ?? 5000;
  const [inner, setInner] = useState(330);
  // Opening the seat map directly (e.g. from a link) still starts a hold — once, on open.
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!cart.holdUntil) cart.startHold();
  }, [cart]);
  // Seats shrink to fit narrow screens, like the board's flex row (max 26pt).
  const seat = Math.min(26, (inner - 14 * 2 - 12 - GAP * 13) / 10);

  const toggle = (seatId: string) => {
    if (picked.includes(seatId)) cart.setSeats(picked.filter(p => p !== seatId));
    else cart.setSeats([...(picked.length >= need ? picked.slice(1) : picked), seatId]);
  };

  const renderSeat = (row: string, n: number) => {
    const seatId = row + n;
    const taken = takenSeats.includes(seatId);
    const mine = picked.includes(seatId);
    return (
      <Pressable
        key={seatId}
        disabled={taken}
        onPress={() => toggle(seatId)}
        accessibilityRole="button"
        accessibilityState={{ disabled: taken, selected: mine }}
        accessibilityLabel={`Seat ${seatId}${taken ? ', taken' : mine ? ', selected' : ''}`}
        hitSlop={2}
        style={{
          width: seat,
          height: 26,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: taken ? c.dot : mine ? c.blue : c.white,
          borderWidth: taken || mine ? 0 : 1.5,
          borderColor: c.seatLine,
        }}
      >
        {taken ? null : <T w={800} s={9} color={mine ? c.white : c.subtle}>{n}</T>}
      </Pressable>
    );
  };

  const done = picked.length === need;
  const left = need - picked.length;

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <BookingHeader step={2} timer title={cart.section} subtitle={`${event.fullName} · Pick ${need} seats`} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Display>Pick your <Hl>seats.</Hl></Display>

        <View
          onLayout={e => setInner(e.nativeEvent.layout.width - 20)}
          style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, paddingVertical: 18, paddingHorizontal: 10, alignItems: 'center', gap: 8 }}
        >
          <View style={{ alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <View style={{ width: 200, height: 6, borderBottomLeftRadius: 999, borderBottomRightRadius: 999, backgroundColor: c.ink }} />
            <T w={800} s={10} ls={0.2} color={c.muted}>STAGE THIS WAY</T>
          </View>
          {seatRows.map(row => (
            <View key={row} style={{ flexDirection: 'row', alignItems: 'center', gap: GAP }}>
              <T w={800} s={11} color={c.muted} align="center" style={{ width: 14 }}>{row}</T>
              {[1, 2, 3, 4, 5].map(n => renderSeat(row, n))}
              <View style={{ width: 12 }} />
              {[6, 7, 8, 9, 10].map(n => renderSeat(row, n))}
              <T w={800} s={11} color={c.muted} align="center" style={{ width: 14 }}>{row}</T>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18 }}>
          <Legend swatch={{ backgroundColor: c.white, borderWidth: 1.5, borderColor: c.seatLine, width: 17, height: 17 }} label="Available" />
          <Legend swatch={{ backgroundColor: c.blue }} label="Yours" />
          <Legend swatch={{ backgroundColor: c.dot }} label="Taken" />
        </View>
      </ScrollView>

      <Footer>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {picked.length ? (
              [...picked].sort().map(p => (
                <View key={p} style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.blueSoft, justifyContent: 'center' }}>
                  <T w={800} s={13} color={c.blueDeep}>Seat {p}</T>
                </View>
              ))
            ) : (
              <T s={14} color={c.muted}>Tap {need} seats</T>
            )}
          </View>
          <T w={800} s={20} ls={-0.02}>{lkr(picked.length * price)}</T>
        </View>
        <PrimaryButton
          label={done ? 'Continue to checkout' : `Pick ${left} more seat${left === 1 ? '' : 's'}`}
          disabled={!done}
          onPress={() => router.push({ pathname: '/event/[id]/checkout', params: { id } })}
        />
      </Footer>
    </View>
  );
}
