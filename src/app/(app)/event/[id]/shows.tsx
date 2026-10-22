import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { showDays, showsByDay } from '@/mocks/extras';
import { img } from '@/ui/assets';
import { BookingHeader } from '@/ui/booking';
import { Footer, PrimaryButton, Rail } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** L1 Pick a show (multi-date events). */
export default function PickShow() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [day, setDay] = useState(17);
  const [time, setTime] = useState(1);
  const list = showsByDay[day];
  const index = list[Math.min(time, list.length - 1)]?.soldOut ? 0 : Math.min(time, list.length - 1);
  const current = list[index];
  const dow = showDays.find(d => d.n === day)?.dow ?? '';

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <BookingHeader step={1} steps={['1 · Show', '2 · Tickets', '3 · Seats', '4 · Pay']} thumb={img.comedy} title="Colombo Comedy Week" subtitle="8 shows · 16–24 Oct · Colombo 03" />
      <ScrollView contentContainerStyle={{ paddingTop: 22, paddingBottom: 20, gap: 16 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Display>Pick a <Hl>show.</Hl></Display>
        </View>
        <Rail gap={8}>
          {showDays.map(d => {
            const on = d.n === day;
            return (
              <Pressable
                key={d.n}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${d.dow} ${d.n} October, ${d.count} ${d.count === 1 ? 'show' : 'shows'}`}
                onPress={() => {
                  setDay(d.n);
                  setTime(0);
                }}
                style={{ width: 62, height: 78, borderRadius: 18, alignItems: 'center', justifyContent: 'center', gap: 3, backgroundColor: on ? c.ink : c.white, borderWidth: on ? 0 : 1, borderColor: c.line }}
              >
                <T w={700} s={11} color={on ? c.white : c.ink} style={{ opacity: 0.8 }}>{d.dow}</T>
                <T w={800} s={22} lh={1} color={on ? c.white : c.ink}>{d.n}</T>
                <T w={700} s={10} color={on ? c.white : c.ink} style={{ opacity: 0.8 }}>{d.count} {d.count === 1 ? 'show' : 'shows'}</T>
              </Pressable>
            );
          })}
        </Rail>
        <View accessibilityRole="radiogroup" style={{ paddingHorizontal: 20, gap: 10 }}>
          {list.map((s, i) => {
            const on = i === index && !s.soldOut;
            return (
              <Pressable
                key={s.time}
                accessibilityRole="radio"
                accessibilityState={{ checked: on, disabled: s.soldOut }}
                disabled={s.soldOut}
                onPress={() => setTime(i)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 18,
                  backgroundColor: s.soldOut ? c.field : c.white,
                  borderWidth: on ? 2 : 1,
                  borderStyle: s.soldOut ? 'dashed' : 'solid',
                  borderColor: s.soldOut ? c.dot : on ? c.blue : c.line,
                  opacity: s.soldOut ? 0.75 : 1,
                }}
              >
                <T w={800} s={20} ls={-0.02} style={{ width: 92 }}>{s.time}</T>
                <View style={{ flex: 1, gap: 2 }}>
                  <T w={800} s={14}>{s.label}</T>
                  <T w={700} s={12} color={s.soldOut ? c.subtle : s.avail === 'Available' ? c.success : c.urgent}>{s.avail}</T>
                </View>
                <T w={800} s={13}>{s.price}</T>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <Footer>
        <T s={14} color={c.ink2}>{dow.charAt(0) + dow.slice(1).toLowerCase()} {day} Oct · {current.time} · {current.label}</T>
        <PrimaryButton label="Choose tickets" onPress={() => router.push({ pathname: '/event/[id]/select', params: { id } })} />
      </Footer>
    </View>
  );
}
