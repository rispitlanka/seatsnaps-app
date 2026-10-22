import { View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

import { img } from '@/ui/assets';
import { Eyebrow, Tap } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { SettingsScreen } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function Line({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <T w={bold ? 800 : 400} s={14} color={bold ? c.ink : c.ink2}>{label}</T>
      <T w={bold ? 800 : 700} s={14}>{value}</T>
    </View>
  );
}

/** L6 Past booking (attended). */
export default function PastBooking() {
  return (
    <SettingsScreen>
      <View style={{ gap: 8 }}>
        <View style={{ alignSelf: 'flex-start', height: 28, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.ink, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="check" size={13} color={c.white} stroke={3} />
          <T w={800} s={12} color={c.white}>Attended</T>
        </View>
        <Display>Tamil Fest <Hl>2026</Hl></Display>
        <T s={13} color={c.muted}>Sat 24 Oct · Nelum Pokuna · checked in 6:58 PM</T>
      </View>

      <View style={{ height: 150, borderRadius: 22, overflow: 'hidden' }}>
        <View style={{ flex: 1, filter: 'grayscale(0.35)' }}>
          <Image source={img.festival} style={{ width: '100%', height: '100%' }} />
        </View>
        <View style={{ position: 'absolute', left: 14, bottom: 14, height: 28, paddingHorizontal: 12, borderRadius: 999, backgroundColor: 'rgba(10,17,48,0.75)', justifyContent: 'center' }}>
          <T w={700} s={12} color={c.white}>2 × Gold · G5, G6</T>
        </View>
      </View>

      <Tap accessibilityRole="button" accessibilityLabel="How was the night? Rate it" onPress={() => router.push('/me/rate')} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: c.ink, borderRadius: 20 }}>
        <View style={{ flex: 1, gap: 6 }}>
          <T w={800} s={16} color={c.white}>How was the night?</T>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {[0, 1, 2, 3, 4].map(i => (
              <Svg key={i} width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={c.periwinkle} strokeWidth={1.8} strokeLinejoin="round">
                <Path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2 6.4 20.2l1.1-6.3L2.9 9.5l6.3-.9z" />
              </Svg>
            ))}
          </View>
        </View>
        <View style={{ height: 40, paddingHorizontal: 16, borderRadius: 999, backgroundColor: c.white, justifyContent: 'center' }}>
          <T w={800} s={14}>Rate it</T>
        </View>
      </Tap>

      <View style={{ gap: 10 }}>
        <Eyebrow>RECEIPT</Eyebrow>
        <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, gap: 10 }}>
          <Line label="Order" value="SS-2410-[ID]" />
          <Line label="2 × Gold" value="LKR 10,000" />
          <Line label="Booking fee" value="LKR 300" />
          <View style={{ paddingTop: 10, borderTopWidth: 1, borderTopColor: c.lineSoft }}>
            <Line label="Paid 14 Oct · Card •••• [last 4]" value="LKR 10,300" bold />
          </View>
          <Tap accessibilityRole="link" style={{ alignSelf: 'flex-start', minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="download" size={16} color={c.blue} stroke={2.2} />
            <T w={800} s={14} color={c.blue}>Download receipt (PDF)</T>
          </Tap>
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Eyebrow>NEXT FROM TAMIL ARTS CIRCLE</Eyebrow>
        <Tap accessibilityRole="button" accessibilityLabel="Deepavali Nights" onPress={() => router.push({ pathname: '/event/[id]', params: { id: 'deepavali-nights' } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18 }}>
          <Image source={img.crowd} style={{ width: 64, height: 64, borderRadius: 12 }} />
          <View style={{ flex: 1, gap: 3 }}>
            <T w={800} s={12} color={c.blue}>Sat 14 Nov · 6:30 PM</T>
            <T w={800} s={15}>Deepavali Nights</T>
          </View>
          <T w={800} s={14} style={{ paddingRight: 8 }}>LKR 1,500</T>
        </Tap>
      </View>
    </SettingsScreen>
  );
}
