import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { event } from '@/mocks/catalog';
import { img } from '@/ui/assets';
import { OutlineButton, PrimaryButton, Tap, useBottomPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const footerLinks = [
  { label: 'Help', go: () => router.push('/help') },
  { label: 'Terms', go: () => router.push('/legal') },
  { label: 'Privacy', go: () => router.push({ pathname: '/legal', params: { tab: 'privacy' } }) },
  { label: 'For organisers', go: () => router.push('/become-organiser') },
];

/**
 * L12 Shared link · mobile web. The landing page someone sees when a friend shares an
 * event link (e.g. /shared/tamil-fest-2026?by=Senthu). Store links aren't set up yet.
 */
export default function SharedLink() {
  const { id = event.id, by = 'a friend' } = useLocalSearchParams<{ id?: string; by?: string }>();
  const { top } = useSafeAreaInsets();
  const bottom = useBottomPad(28);
  const [banner, setBanner] = useState(true);
  const toEvent = () => router.push({ pathname: '/event/[id]', params: { id } });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ flexGrow: 1, paddingTop: top }}>
      <StatusBar style="dark" />
      {banner ? (
        <View accessibilityLabel="Get the app" style={{ backgroundColor: c.white, borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Tap accessibilityRole="button" accessibilityLabel="Dismiss app banner" onPress={() => setBanner(false)} style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="close" size={16} color={c.muted} stroke={2.4} />
          </Tap>
          <Image source={img.appIcon} style={{ width: 40, height: 40, borderRadius: 10 }} />
          <View style={{ flex: 1, gap: 1 }}>
            <T w={800} s={14}>SeatSnaps</T>
            <T s={12} color={c.muted}>Book faster in the free app</T>
          </View>
          <Tap accessibilityRole="button" onPress={toEvent} style={{ height: 34, paddingHorizontal: 14, borderRadius: 999, backgroundColor: c.blue, justifyContent: 'center' }}>
            <T w={800} s={13} color={c.white}>Open</T>
          </Tap>
        </View>
      ) : null}

      <View style={{ backgroundColor: c.ink, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Image source={img.wordmarkWhite} style={{ width: 132, height: 25 }} accessibilityLabel="SeatSnaps" />
        <Tap accessibilityRole="button" onPress={() => router.push('/login')} style={{ height: 36, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', justifyContent: 'center' }}>
          <T w={700} s={13} color={c.white}>Sign in</T>
        </Tap>
      </View>

      <View style={{ height: 240 }}>
        <Image source={img.festival} accessibilityLabel="Festival crowd under bunting" style={{ width: '100%', height: '100%' }} />
        <View style={{ position: 'absolute', left: 16, top: 16, height: 30, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.white, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 22, height: 22, borderRadius: 999, backgroundColor: c.blue, alignItems: 'center', justifyContent: 'center' }}>
            <T w={800} s={10} color={c.white}>{by.charAt(0).toUpperCase()}</T>
          </View>
          <T w={800} s={12}>Shared by {by}</T>
        </View>
      </View>

      <View style={{ paddingVertical: 22, paddingHorizontal: 16, gap: 16, backgroundColor: c.white }}>
        <Display size={30}>Tamil Fest <Hl>2026</Hl></Display>
        <View style={{ gap: 6 }}>
          <T s={14} color={c.ink2}><T w={700} s={14}>Sat 24 Oct</T> · 7:30 PM – 11:00 PM</T>
          <T s={14} color={c.ink2}><T w={700} s={14}>Nelum Pokuna Theatre</T> · Colombo 07</T>
          <T s={14} color={c.ink2}>From <T w={700} s={14}>LKR 2,000</T> · Only 12 VIP seats left</T>
        </View>
        <View style={{ gap: 10 }}>
          <PrimaryButton label="Open in the app" onPress={toEvent} />
          <OutlineButton label="Buy tickets on the web" s={16} height={56} onPress={() => router.push({ pathname: '/event/[id]/select', params: { id } })} />
        </View>
      </View>

      <View style={{ paddingVertical: 22, paddingHorizontal: 16, gap: 14 }}>
        <Display size={18}>Get the <Hl>app</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>Pick seats on a live map, keep tickets offline, and get reminders before the show.</T>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            ['Download on the', 'App Store'],
            ['Get it on', 'Google Play'],
          ].map(([small, big]) => (
            <Tap key={big} accessibilityRole="link" accessibilityLabel={`${small} ${big}`} style={{ flex: 1, height: 52, borderRadius: 14, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
              <T s={9} color={c.white} lh={1.1}>{small}</T>
              <T w={800} s={14} color={c.white} lh={1.1}>{big}</T>
            </Tap>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 'auto', backgroundColor: c.ink, paddingTop: 22, paddingHorizontal: 16, paddingBottom: bottom, gap: 10 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {footerLinks.map(link => (
            <Tap key={link.label} accessibilityRole="link" onPress={link.go}>
              <T w={700} s={12} color={c.white}>{link.label}</T>
            </Tap>
          ))}
        </View>
        <T s={12} color={c.onDarkMuted}>© 2026 SeatSnaps</T>
      </View>
    </ScrollView>
  );
}
