import { useState } from 'react';
import { Linking, ScrollView, Share, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { VenueDesign } from '../design-model';
import { BackButton, CircleButton, SectionHeader, Tap, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function Label({ children }: { children: string }) {
  return <T w={800} s={11} ls={0.2} color={c.blue}>{children}</T>;
}

const card = { backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20 } as const;

/** Static map illustration from the board. */
function VenueMap() {
  return (
    <Svg width="100%" height={160} viewBox="0 0 350 160" preserveAspectRatio="xMidYMid slice" accessibilityLabel="Illustrative venue map; use directions for the actual location" style={{ backgroundColor: '#E9EDF7' }}>
      <Path d="M220 0 C 250 40, 300 50, 350 45 L 350 0 Z" fill="#C9D8FB" />
      <Path d="M-10 120 L 360 70" stroke="#FFFFFF" strokeWidth={14} />
      <Path d="M60 -10 L 120 170" stroke="#FFFFFF" strokeWidth={10} />
      <Path d="M240 -10 L 200 170" stroke="#FFFFFF" strokeWidth={8} />
      <Path d="M-10 40 L 360 20" stroke="#FFFFFF" strokeWidth={6} />
      <Rect x="128" y="96" width="56" height="34" rx="6" fill="#D6E0F5" />
      <Rect x="250" y="100" width="70" height="40" rx="6" fill="#D6E0F5" />
      <Circle cx="160" cy="82" r="20" fill={c.blue} opacity={0.18} />
      <Path d="M160 92 C 160 92 148 80 148 72 a 12 12 0 0 1 24 0 c 0 8 -12 20 -12 20 z" fill={c.blue} />
      <Circle cx="160" cy="72" r="4.5" fill="#FFFFFF" />
    </Svg>
  );
}

/** E1 Venue. */
export default function Venue({ model }: { model: VenueDesign }) {
  const { venue } = model;
  const directions = () => { void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + ' ' + venue.address)}`).catch(() => {}); };
  const top = useTopPad();
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ paddingBottom: 28 }}>
      <StatusBar style="light" />
      <View style={{ height: 268 + top, backgroundColor: c.ink }}>
        <Image source={venue.img} accessibilityLabel={venue.name} style={{ width: '100%', height: '100%' }} />
        <View style={{ position: 'absolute', top, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <BackButton variant="solid" />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <CircleButton icon="share" label="Share" variant="solid" iconSize={19} stroke={2} onPress={() => Share.share({ message: `${venue.name} ${venue.nameAccent} on SeatSnaps` })} />
            <CircleButton icon="heart" label={saved ? 'Saved venue' : 'Save venue'} variant="solid" iconSize={19} stroke={2} color={saved ? c.blue : c.ink} onPress={() => setSaved(s => !s)} />
          </View>
        </View>
        <View style={{ position: 'absolute', left: 20, bottom: 44, height: 28, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.white, justifyContent: 'center' }}>
          <T w={800} s={12}>{venue.type}</T>
        </View>
      </View>

      <View style={{ marginTop: -28, backgroundColor: c.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingTop: 24, paddingBottom: 24, gap: 16 }}>
        <View style={{ gap: 8 }}>
          <Display>{venue.name} <Hl>{venue.nameAccent}</Hl></Display>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="pin" size={15} color={c.blue} stroke={2.2} />
            <T s={13} color={c.muted} style={{ flex: 1 }}>{venue.address}</T>
          </View>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: c.page, borderRadius: 18, paddingVertical: 14 }}>
          {venue.stats.map(([value, label], i) => (
            <View key={label} style={{ flex: 1, alignItems: 'center', gap: 2, borderLeftWidth: i === 1 ? 1 : 0, borderRightWidth: i === 1 ? 1 : 0, borderColor: c.line }}>
              <T w={800} s={18}>{value}</T>
              <T s={12} color={c.muted}>{label}</T>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Tap accessibilityRole="button" accessibilityState={{ selected: following }} onPress={() => setFollowing(f => !f)} style={{ flex: 1, height: 50, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: following ? c.white : c.blue, borderWidth: following ? 1 : 0, borderColor: c.line }}>
            <T w={800} s={15} color={following ? c.ink : c.white}>{following ? 'Following' : 'Follow venue'}</T>
          </Tap>
          <Tap accessibilityRole="button" onPress={directions} style={{ flex: 1, height: 50, borderRadius: 999, borderWidth: 1, borderColor: c.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Icon name="navigate" size={18} color={c.blue} />
            <T w={700} s={15}>Directions</T>
          </Tap>
        </View>
      </View>

      <View style={{ paddingTop: 26, paddingHorizontal: 20, gap: 30 }}>
        <View style={{ gap: 12 }}>
          <SectionHeader action={`${venue.events.length} events`}>
            <Display size={18}>{"What's "}<Hl>on here</Hl></Display>
          </SectionHeader>
          {venue.events.map(e => (
            <Tap key={e.id} accessibilityRole="button" accessibilityLabel={e.name} onPress={() => router.push({ pathname: '/event/[id]', params: { id: e.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, ...card, borderRadius: 18 }}>
              <View style={{ width: 60, height: 64, borderRadius: 14, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} s={10} color={c.periwinkle}>{e.mon}</T>
                <T w={800} s={22} lh={1} color={c.white}>{e.day}</T>
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <T w={800} s={15}>{e.name}</T>
                <T s={12} color={c.muted}>{e.meta}</T>
              </View>
              <T w={800} s={14} color={c.blue} style={{ paddingRight: 8 }}>{e.price}</T>
            </Tap>
          ))}
        </View>

        <View style={{ gap: 12 }}>
          <Label>ABOUT THE VENUE</Label>
          <T s={14} lh={1.6} color={c.ink2}>{venue.about}</T>
        </View>

        <View style={{ gap: 12 }}>
          <Label>SEATING LAYOUT</Label>
          <View style={{ ...card, padding: 16, gap: 8 }}>
            <View style={{ alignSelf: 'center', width: '64%', height: 26, borderBottomLeftRadius: 60, borderBottomRightRadius: 60, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} s={10} ls={0.24} color={c.white}>STAGE</T>
            </View>
            {[
              { label: 'VIP · A–D', h: 30, bg: c.ink, fg: c.white, mx: 28 },
              { label: 'GOLD · E–J', h: 40, bg: c.blue, fg: c.white, mx: 12 },
              { label: 'SILVER · K–R', h: 40, bg: c.periwinkle, fg: c.ink, mx: 0 },
              { label: 'BALCONY', h: 28, bg: c.pale, fg: c.ink, mx: 0 },
            ].map(b => (
              <View key={b.label} style={{ height: b.h, marginHorizontal: b.mx, borderRadius: 10, backgroundColor: b.bg, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} s={11} color={b.fg}>{b.label}</T>
              </View>
            ))}
            <T s={12} color={c.muted} align="center" style={{ marginTop: 4 }}>Layout can change per event — check each event&apos;s seat map.</T>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Label>FACILITIES</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {venue.facilities.map(f => (
              <View key={f} style={{ flexBasis: '40%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, ...card, borderRadius: 16 }}>
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={16} color={c.blue} stroke={2.6} />
                </View>
                <T w={700} s={13} style={{ flex: 1 }}>{f}</T>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Label>GETTING THERE</Label>
          <View style={{ ...card, overflow: 'hidden' }}>
            <VenueMap />
            <View style={{ paddingTop: 14, paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
              <View style={{ gap: 6 }}>
                <T s={13} color={c.ink2}><T w={700} s={13}>Parking</T> · Check with the venue</T>
                <T s={13} color={c.ink2}><T w={700} s={13}>Bus</T> · Check local routes for this address</T>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Tap accessibilityRole="button" onPress={directions} style={{ flex: 1, height: 44, borderRadius: 999, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <T w={800} s={14} color={c.blueDeep}>Open in Maps</T>
                </Tap>
                <Tap accessibilityRole="button" style={{ flex: 1, height: 46, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
                  <T w={700} s={14}>Call venue</T>
                </Tap>
              </View>
            </View>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Label>PAST EVENTS HERE</Label>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {venue.past.map((source, i) => (
              <Image key={i} source={source} style={{ flex: 1, height: 100, borderRadius: 14 }} />
            ))}
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Label>CONTACT &amp; HOURS</Label>
          <View style={{ ...card, paddingVertical: 4, paddingHorizontal: 16 }}>
            {venue.contact.map(([k, v], i) => (
              <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: i < venue.contact.length - 1 ? 1 : 0, borderBottomColor: c.lineSoft }}>
                <T s={14} color={c.ink2}>{k}</T>
                <T w={700} s={14} color={k === 'Website' ? c.blue : c.ink}>{v}</T>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
