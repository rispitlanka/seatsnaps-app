import { Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { event, lkr, sections, tiers } from '@/mocks/catalog';
import { useCart } from '@/providers/cart';
import { BookingHeader } from '@/ui/booking';
import { Footer, PrimaryButton } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function Block({ label, height, bg = c.segment, color = c.subtle, mx = 0 }: { label: string; height: number; bg?: string; color?: string; mx?: number }) {
  return (
    <View style={{ height, marginHorizontal: mx, borderRadius: 12, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <T w={800} s={12} color={color}>{label}</T>
    </View>
  );
}

function Legend({ swatch, label }: { swatch: object; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 12, height: 12, borderRadius: 4, ...swatch }} />
      <T s={12} color={c.ink2}>{label}</T>
    </View>
  );
}

/** D3 Choose section. */
export default function ChooseSection() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cart = useCart();
  const current = sections.find(s => s.name === cart.section) ?? sections[1];
  const price = tiers.find(t => t.name === cart.tier)?.price ?? 5000;

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <BookingHeader step={2} title={event.fullName} subtitle={`${cart.summary || '2 × Gold'} · Sat 24 Oct, 7:30 PM`} />
      <ScrollView contentContainerStyle={{ paddingVertical: 22, paddingHorizontal: 20, gap: 16 }}>
        <View style={{ gap: 8 }}>
          <Display>Choose a <Hl>section.</Hl></Display>
          <T s={14} lh={1.5} color={c.ink2}>Your {cart.tier} tickets can be used in any {cart.tier} block.</T>
        </View>

        <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, paddingVertical: 18, paddingHorizontal: 14, gap: 10 }}>
          <View style={{ alignSelf: 'center', width: '64%', height: 30, borderBottomLeftRadius: 60, borderBottomRightRadius: 60, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
            <T w={800} s={10} ls={0.24} color={c.white}>STAGE</T>
          </View>
          <Block label="VIP · not in your tickets" height={40} mx={30} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {sections.map((s, i) => {
              const on = s.name === current.name;
              return (
                <Pressable
                  key={s.name}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${s.name}, ${s.left}`}
                  onPress={() => cart.setSection(s.name)}
                  style={{ flex: i === 1 ? 1.4 : 1, height: 76, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: on ? c.blue : c.white, borderWidth: on ? 0 : 1.5, borderColor: c.blue }}
                >
                  <T w={800} s={12} color={on ? c.white : c.blueDeep}>{s.short}</T>
                  <T w={600} s={11} color={on ? c.white : c.blueDeep} style={{ opacity: 0.85 }}>{s.left}</T>
                </Pressable>
              );
            })}
          </View>
          <Block label="SILVER" height={50} />
          <Block label="BALCONY" height={36} bg={c.lineSoft} />
        </View>

        <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
          <Legend swatch={{ backgroundColor: c.blue }} label="Selected" />
          <Legend swatch={{ backgroundColor: c.white, borderWidth: 1.5, borderColor: c.blue, width: 15, height: 15 }} label="Available" />
          <Legend swatch={{ backgroundColor: c.segment }} label="Other tickets" />
        </View>
      </ScrollView>

      <Footer>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <View style={{ gap: 2, flex: 1 }}>
            <T w={800} s={15}>{current.name}</T>
            <T s={12} color={c.muted}>{current.note} · {lkr(price)} each</T>
          </View>
          <T w={700} s={13} color={c.ink2}>{cart.count} seats to pick</T>
        </View>
        <PrimaryButton
          label="Pick seats"
          onPress={() => {
            cart.startHold();
            router.push({ pathname: '/event/[id]/seats', params: { id } });
          }}
        />
      </Footer>
    </View>
  );
}
