import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { mapPins } from '@/mocks/support';
import { Tap, goBack, useBottomPad, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const float = '0 4px 12px rgba(10,17,48,0.12)';

/** Illustrated map from the board, stretched to the screen. */
function MapArt({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }} accessibilityLabel="Map of Colombo with event pins">
      <Path d="M0 0 L 70 0 C 60 160, 90 300, 70 460 C 55 600, 85 720, 60 844 L 0 844 Z" fill="#C9D8FB" />
      <Path d="M200 380 C 240 360, 290 390, 280 430 C 270 470, 220 470, 205 440 Z" fill="#C9D8FB" />
      <G stroke="#FFFFFF" fill="none" strokeLinecap="round">
        <Path d="M90 0 L 120 844" strokeWidth={16} />
        <Path d="M70 250 L 390 210" strokeWidth={12} />
        <Path d="M75 560 L 390 520" strokeWidth={12} />
        <Path d="M180 0 L 230 844" strokeWidth={9} />
        <Path d="M300 0 L 330 844" strokeWidth={9} />
        <Path d="M80 400 L 390 360" strokeWidth={7} />
        <Path d="M80 700 L 390 660" strokeWidth={7} />
        <Path d="M85 130 L 390 100" strokeWidth={6} />
      </G>
      <G fill="#D9E1F3">
        <Rect x="135" y="270" width="36" height="40" rx="6" />
        <Rect x="240" y="250" width="44" height="50" rx="6" />
        <Rect x="140" y="590" width="60" height="44" rx="6" />
        <Rect x="250" y="580" width="46" height="60" rx="6" />
        <Rect x="140" y="420" width="30" height="40" rx="6" />
        <Rect x="345" y="420" width="40" height="70" rx="6" />
      </G>
      <Circle cx="210" cy="500" r="34" fill={c.blue} opacity={0.12} />
      <Circle cx="210" cy="500" r="8" fill={c.blue} stroke="#FFFFFF" strokeWidth={3} />
    </Svg>
  );
}

/** H2 Map view. */
export default function MapView() {
  const { width, height } = useWindowDimensions();
  const top = useTopPad();
  const bottom = useBottomPad();
  const [selected, setSelected] = useState(1);
  const sel = mapPins[selected];
  // Pins are placed on the board's 390×844 canvas and scaled to the screen.
  const sx = width / 390;
  const sy = height / 844;

  return (
    <View style={{ flex: 1, backgroundColor: c.mapBg }}>
      <StatusBar style="dark" />
      <MapArt width={width} height={height} />

      {mapPins.map((p, i) => {
        const on = i === selected;
        return (
          <Tap
            key={p.id}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${p.name}, ${p.price}`}
            onPress={() => setSelected(i)}
            style={{ position: 'absolute', left: p.x * sx, top: p.y * sy, height: 34, paddingHorizontal: 12, borderRadius: 999, justifyContent: 'center', backgroundColor: on ? c.blue : c.white, boxShadow: '0 6px 14px rgba(10,17,48,0.22)', transform: [{ scale: on ? 1.12 : 1 }] }}
          >
            <T w={800} s={13} color={on ? c.white : c.ink}>{p.price}</T>
          </Tap>
        );
      })}

      <View style={{ position: 'absolute', top, left: 16, right: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Tap accessibilityRole="button" accessibilityLabel="Back" onPress={() => goBack()} style={{ width: 48, height: 48, borderRadius: 999, backgroundColor: c.white, alignItems: 'center', justifyContent: 'center', boxShadow: float }}>
            <Icon name="chevronLeft" size={20} stroke={2.2} />
          </Tap>
          <Tap accessibilityRole="search" onPress={() => router.push('/search')} style={{ flex: 1, height: 48, borderRadius: 999, backgroundColor: c.white, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, boxShadow: float }}>
            <Icon name="search" size={17} color={c.muted} />
            <T s={14} color={c.subtle}>Search this area</T>
          </Tap>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ height: 36, paddingHorizontal: 14, borderRadius: 999, backgroundColor: c.ink, justifyContent: 'center', boxShadow: float }}>
            <T w={700} s={13} color={c.white}>This weekend</T>
          </View>
          <View style={{ height: 36, paddingHorizontal: 14, borderRadius: 999, backgroundColor: c.white, justifyContent: 'center', boxShadow: float }}>
            <T w={600} s={13}>All categories</T>
          </View>
          <Tap accessibilityRole="button" onPress={() => router.push('/filters')} style={{ height: 36, paddingHorizontal: 14, borderRadius: 999, backgroundColor: c.white, justifyContent: 'center', boxShadow: float }}>
            <T w={600} s={13}>Filters</T>
          </Tap>
        </View>
      </View>

      <Tap accessibilityRole="button" accessibilityLabel="Re-centre on my location" style={{ position: 'absolute', right: 16, bottom: bottom + 206, width: 48, height: 48, borderRadius: 999, backgroundColor: c.white, alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(10,17,48,0.15)' }}>
        <Icon name="navigate" size={20} color={c.blue} stroke={2.2} />
      </Tap>

      <View style={{ position: 'absolute', left: 16, right: 16, bottom, alignItems: 'center', gap: 10 }}>
        <Tap accessibilityRole="button" accessibilityLabel={sel.name} onPress={() => router.push({ pathname: '/event/[id]', params: { id: sel.id } })} style={{ width: '100%', flexDirection: 'row', gap: 12, padding: 10, backgroundColor: c.white, borderRadius: 22, boxShadow: '0 12px 28px rgba(10,17,48,0.2)' }}>
          <Image source={sel.img} style={{ width: 92, height: 92, borderRadius: 14 }} />
          <View style={{ flex: 1, minWidth: 0, gap: 4, paddingVertical: 2, paddingRight: 4 }}>
            <T w={800} s={12} color={c.blue}>{sel.date}</T>
            <T w={800} s={15}>{sel.name}</T>
            <T s={12} color={c.muted}>{sel.venue} · {sel.dist}</T>
            <T w={800} s={14} style={{ marginTop: 'auto' }}>{sel.price}</T>
          </View>
        </Tap>
        <Tap accessibilityRole="button" onPress={() => router.push('/results')} style={{ height: 40, paddingHorizontal: 16, borderRadius: 999, backgroundColor: c.ink, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="list" size={16} color={c.white} stroke={2.2} />
          <T w={700} s={13} color={c.white}>List view</T>
        </Tap>
      </View>
    </View>
  );
}
