import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Path } from 'react-native-svg';

import { lkr } from '@/mocks/catalog';
import { useCart } from '@/providers/cart';
import { img } from '@/ui/assets';
import { useBottomPad, useTopPad } from '@/ui/components';
import { StepDot } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** I3 Payment processing; continues to confirmed (or failed for declined test cards). */
export default function Processing() {
  const { fail } = useLocalSearchParams<{ fail?: string }>();
  const cart = useCart();
  const top = useTopPad();
  const bottom = useBottomPad(40);
  const spin = useRef(new Animated.Value(0)).current;
  const endHold = useRef(cart.endHold);
  endHold.current = cart.endHold;
  const seats = [...cart.seats].sort().join(', ') || 'G5, G6';

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    const timer = setTimeout(() => {
      if (!fail) endHold.current();
      router.replace(fail ? '/booking/failed' : '/booking/confirmed');
    }, 2200);
    return () => {
      loop.stop();
      clearTimeout(timer);
    };
  }, [fail, spin]);

  return (
    <View style={{ flex: 1, backgroundColor: c.white, alignItems: 'center', paddingTop: top, paddingHorizontal: 24, paddingBottom: bottom, gap: 22 }}>
      <StatusBar style="dark" />
      <View style={{ marginTop: 120, width: 112, height: 112 }}>
        <Animated.View style={{ transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
          <Svg width={112} height={112} viewBox="0 0 112 112">
            <Circle cx="56" cy="56" r="48" fill="none" stroke={c.blueSoft} strokeWidth={10} />
            <Path d="M56 8 a48 48 0 0 1 48 48" fill="none" stroke={c.blue} strokeWidth={10} strokeLinecap="round" />
          </Svg>
        </Animated.View>
        <Image source={img.appIcon} style={{ position: 'absolute', left: 32, top: 32, width: 48, height: 48 }} />
      </View>

      <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ alignItems: 'center', gap: 10 }}>
        <Display size={28} style={{ textAlign: 'center' }}>Processing <Hl>payment…</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2} align="center" style={{ maxWidth: 290 }}>Hold tight — this usually takes a few seconds. Please don&apos;t close the app.</T>
      </View>

      <View style={{ width: '100%', backgroundColor: c.page, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <StepDot state="done" />
          <T w={700} s={14} color={c.success}>Seats {seats} held</T>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <StepDot state="current" />
          <T w={800} s={14} color={c.blueDeep}>Confirming with your bank</T>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <StepDot state="todo" />
          <T w={600} s={14} color={c.subtle}>Issuing your tickets</T>
        </View>
      </View>

      <View style={{ marginTop: 'auto', alignItems: 'center', gap: 6 }}>
        <T s={13} color={c.muted}>Paying {lkr(cart.total)} · Card •••• [last 4]</T>
        <T s={12} color={c.subtle}>Your bank may ask you to verify in a pop-up.</T>
      </View>
    </View>
  );
}
