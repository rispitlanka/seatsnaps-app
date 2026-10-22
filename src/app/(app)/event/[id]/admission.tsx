import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { lkr } from '@/mocks/catalog';
import { gaTiers } from '@/mocks/support';
import { img } from '@/ui/assets';
import { BookingHeader } from '@/ui/booking';
import { Footer, PrimaryButton } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { QtyStepper } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const MAX = 10;

/** I1 General admission tickets (no seat picking). */
export default function GeneralAdmission() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [qty, setQty] = useState<Record<string, number>>({ 'Early bird': 0, 'General entry': 2, 'Family pass': 0 });
  const count = gaTiers.reduce((n, t) => n + qty[t.name], 0);
  const total = gaTiers.reduce((n, t) => n + qty[t.name] * t.price, 0);
  const summary = gaTiers.filter(t => qty[t.name]).map(t => `${qty[t.name]} × ${t.name}`).join(', ');
  const set = (name: string, n: number) => setQty(q => ({ ...q, [name]: n }));

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <BookingHeader step={1} steps={['1 · Tickets', '2 · Checkout']} thumb={img.expo} title="Colombo Food Fair" subtitle="Sat 31 Oct · 11 AM – 9 PM · Galle Face" />
      <ScrollView contentContainerStyle={{ paddingVertical: 22, paddingHorizontal: 20, gap: 14 }}>
        <Display style={{ marginBottom: 4 }}>Select <Hl>tickets.</Hl></Display>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 14 }}>
          <Icon name="users" size={18} color={c.blue} />
          <T s={13} color={c.ink2} style={{ flex: 1 }}>General admission — no assigned seats. Entry any time on the day.</T>
        </View>

        {gaTiers.map(t => {
          const n = qty[t.name];
          return (
            <View
              key={t.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 14,
                borderRadius: 18,
                backgroundColor: t.soldOut ? c.field : c.white,
                borderWidth: !t.soldOut && n ? 2 : 1,
                borderStyle: t.soldOut ? 'dashed' : 'solid',
                borderColor: t.soldOut ? c.dot : n ? c.blue : c.line,
                opacity: t.soldOut ? 0.8 : 1,
              }}
            >
              <View style={{ flex: 1, gap: 3 }}>
                <T w={800} s={15}>{t.name}</T>
                <T s={12} color={c.muted}>{t.perk}</T>
                <T w={800} s={14} color={c.blue}>{lkr(t.price)}</T>
              </View>
              {t.soldOut ? (
                <View style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.segmentAlt, justifyContent: 'center' }}>
                  <T w={800} s={12} color={c.muted}>Sold out</T>
                </View>
              ) : (
                <QtyStepper qty={n} label={t.name} onMinus={() => n > 0 && set(t.name, n - 1)} onPlus={() => count < MAX && set(t.name, n + 1)} />
              )}
            </View>
          );
        })}
      </ScrollView>
      <Footer>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <T s={14} color={c.ink2}>{count ? summary : 'No tickets yet'}</T>
          <T w={800} s={20} ls={-0.02}>{lkr(total)}</T>
        </View>
        <PrimaryButton label="Continue to checkout" disabled={!count} onPress={() => router.push({ pathname: '/event/[id]/checkout', params: { id } })} />
      </Footer>
    </View>
  );
}
