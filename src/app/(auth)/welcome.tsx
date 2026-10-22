import { View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { img } from '@/ui/assets';
import { PrimaryButton, TextButton, useBottomPad, useTopPad } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** B4 Welcome (alternative single-screen intro). */
export default function Welcome() {
  const top = useTopPad(12);
  const bottom = useBottomPad(36);
  return (
    <View style={{ flex: 1, backgroundColor: c.ink, paddingTop: top, paddingHorizontal: 24, paddingBottom: bottom, gap: 28 }}>
      <StatusBar style="light" />
      <Image source={img.wordmarkWhite} style={{ width: 158, height: 30 }} accessibilityLabel="SeatSnaps" />

      <View style={{ height: 300, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={img.crowd}
          accessibilityLabel="Crowd with phones raised at a concert"
          style={{ width: 230, height: 280, borderRadius: 24, borderWidth: 1, borderColor: '#2A3A7A', transform: [{ rotate: '4deg' }] }}
        />
        <View style={{ position: 'absolute', left: 4, bottom: 18, backgroundColor: c.white, borderRadius: 16, flexDirection: 'row', overflow: 'hidden', boxShadow: '0 18px 40px rgba(0,0,0,0.35)' }}>
          <View style={{ width: 56, backgroundColor: c.blue, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 }}>
            <T w={600} s={10} ls={0.1} color={c.white}>ROW</T>
            <T w={800} s={26} lh={1} color={c.white}>01</T>
          </View>
          <View style={{ paddingVertical: 12, paddingHorizontal: 16, gap: 4 }}>
            <T w={700} s={13}>Tamil Fest 2026</T>
            <T s={11} color={c.muted}>Sat 24 Oct · 7:30 PM</T>
            <T w={800} s={15} color={c.blue}>LKR 5,000</T>
          </View>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Display size={44} color={c.white} accent={c.blueBright}>
          {'The night\n'}<Hl>belongs</Hl>{'\nto you.'}
        </Display>
        <T s={15} lh={1.5} color={c.onDarkMuted}>Find and book seats for concerts, sports, comedy and more — in a few taps.</T>
      </View>

      <View style={{ marginTop: 'auto', gap: 12 }}>
        <PrimaryButton label="Get started" onPress={() => router.push('/signup')} />
        <TextButton label="I already have an account" color={c.white} height={48} onPress={() => router.push('/login')} />
      </View>
    </View>
  );
}
