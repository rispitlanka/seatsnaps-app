import { useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { img } from '@/ui/assets';
import { Segmented, Tap } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { SettingsScreen } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function Pill({ label, soft }: { label: string; soft?: boolean }) {
  return (
    <View style={{ height: 28, paddingHorizontal: 10, borderRadius: 999, backgroundColor: soft ? c.blueSoft : c.page, justifyContent: 'center' }}>
      <T w={soft ? 800 : 700} s={12} color={soft ? c.blueDeep : c.ink}>{label}</T>
    </View>
  );
}

/** E3 My tickets & bookings. */
export default function MyTickets() {
  const [tab, setTab] = useState('Upcoming (2)');

  return (
    <SettingsScreen>
      <View style={{ gap: 8 }}>
        <Display>My <Hl>tickets.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>Orders placed through SeatSnaps.</T>
      </View>

      <Segmented options={['Upcoming (2)', 'Past']} value={tab} onChange={setTab} />

      {tab === 'Past' ? (
        <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 24, paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center', gap: 12 }}>
          <View style={{ width: 72, height: 72, borderRadius: 999, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ticket" size={30} color={c.blue} />
          </View>
          <T w={800} s={17}>No past events yet</T>
          <T s={14} lh={1.5} color={c.ink2} align="center">Events you&apos;ve attended will show up here.</T>
          <Tap accessibilityRole="link" onPress={() => router.navigate('/')} style={{ marginTop: 4 }}>
            <T w={800} s={15} color={c.blue}>Browse events →</T>
          </Tap>
        </View>
      ) : (
        <View style={{ gap: 14 }}>
          <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, overflow: 'hidden' }}>
            <View style={{ height: 120 }}>
              <Image source={img.festival} style={{ width: '100%', height: '100%' }} />
              <View style={{ position: 'absolute', top: 12, left: 12, height: 28, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.white, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="check" size={13} color={c.success} stroke={3} />
                <T w={800} s={12} color={c.success}>Confirmed</T>
              </View>
              <View style={{ position: 'absolute', top: 12, right: 12, height: 28, paddingHorizontal: 10, borderRadius: 999, backgroundColor: 'rgba(10,17,48,0.72)', justifyContent: 'center' }}>
                <T w={700} s={12} color={c.white}>In 10 days</T>
              </View>
            </View>
            <View style={{ paddingTop: 14, paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
              <View style={{ gap: 3 }}>
                <T w={800} s={17} ls={-0.01}>Tamil Fest 2026</T>
                <T s={13} color={c.muted}>Sat 24 Oct · 7:30 PM · Nelum Pokuna</T>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <Pill label="2 × Gold" soft />
                <Pill label="Seats G5, G6" />
                <Pill label="LKR 10,300" />
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Tap accessibilityRole="button" onPress={() => router.push({ pathname: '/me/booking/[id]', params: { id: 'ss-2410' } })} style={{ flex: 1, height: 44, borderRadius: 999, backgroundColor: c.blue, alignItems: 'center', justifyContent: 'center' }}>
                  <T w={800} s={14} color={c.white}>View tickets</T>
                </Tap>
                <Tap accessibilityRole="button" onPress={() => router.push({ pathname: '/explore/venue/[id]', params: { id: 'nelum-pokuna-theatre' } })} style={{ flex: 1, height: 46, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
                  <T w={700} s={14}>Venue &amp; directions</T>
                </Tap>
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image source={img.boardGames} style={{ width: 84, height: 84, borderRadius: 14 }} />
            <View style={{ flex: 1, gap: 4 }}>
              <T w={800} s={12} color={c.blue}>Sat 17 Oct · 4:00 PM</T>
              <T w={800} s={15}>Board Game Hangout 6</T>
              <T s={12} color={c.muted}>1 × Free entry · No seat</T>
            </View>
            <Tap accessibilityRole="button" accessibilityLabel="View ticket for Board Game Hangout 6" onPress={() => router.push('/booking/ticket')} style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="chevronRight" size={18} color={c.blue} stroke={2.2} />
            </Tap>
          </View>
        </View>
      )}
    </SettingsScreen>
  );
}
