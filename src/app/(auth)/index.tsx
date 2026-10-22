import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { img } from '@/ui/assets';
import { useBottomPad, useTopPad } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** A1 Splash → A2 Splash loading → onboarding. */
export default function SplashScreen() {
  const [stage, setStage] = useState<'brand' | 'loading'>('brand');
  const progress = useRef(new Animated.Value(0)).current;
  const top = useTopPad(16);
  const bottom = useBottomPad(48);

  useEffect(() => {
    if (stage === 'brand') {
      const timer = setTimeout(() => setStage('loading'), 1200);
      return () => clearTimeout(timer);
    }
    const run = Animated.timing(progress, { toValue: 1, duration: 1400, useNativeDriver: false });
    run.start(({ finished }) => finished && router.replace('/onboarding'));
    return () => run.stop();
  }, [progress, stage]);

  if (stage === 'brand') {
    return (
      <Pressable accessibilityLabel="SeatSnaps" onPress={() => setStage('loading')} style={{ flex: 1, backgroundColor: c.heroTop, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <StatusBar style="light" />
        <View style={{ position: 'absolute', top: -90, right: -110, width: 392, height: 392, borderRadius: 999, borderWidth: 46, borderColor: '#3D5FD6' }} />
        <View style={{ position: 'absolute', bottom: -120, left: -120, width: 412, height: 412, borderRadius: 999, borderWidth: 46, borderColor: '#2843A8' }} />
        <View style={{ alignItems: 'center', gap: 18 }}>
          <Image source={img.splashMark} style={{ width: 120, height: 120 }} />
          <Image source={img.splashWordmark} style={{ width: 210, height: 40 }} accessibilityLabel="SeatSnaps" />
        </View>
        <T w={600} s={11} ls={0.24} color={c.onDark} style={{ position: 'absolute', bottom: 44 }}>
          LIVE EVENTS ACROSS SRI LANKA
        </T>
      </Pressable>
    );
  }

  return (
    <Pressable accessibilityLabel="Continue" onPress={() => router.replace('/onboarding')} style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient colors={[c.heroTop, c.heroBottom, c.night]} locations={[0, 0.55, 1]} style={{ flex: 1, paddingTop: top, paddingHorizontal: 28, paddingBottom: bottom, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: 210, right: -150, width: 468, height: 468, borderRadius: 999, borderWidth: 54, borderColor: c.white, opacity: 0.07 }} />
        <Image source={img.wordmarkWhite} style={{ width: 169, height: 32 }} accessibilityLabel="SeatSnaps" />
        <View style={{ marginTop: 'auto', gap: 16 }}>
          <T w={600} s={11} ls={0.24} color={c.onDark}>LIVE EVENTS ACROSS SRI LANKA</T>
          <Display size={48} color={c.white} accent={c.blueSoftLine}>
            {'The night\n'}<Hl>belongs</Hl>{'\nto you.'}
          </Display>
        </View>
        <View style={{ marginTop: 64, gap: 12 }}>
          <View accessibilityRole="progressbar" style={{ height: 4, borderRadius: 999, backgroundColor: c.navyLine, overflow: 'hidden' }}>
            <Animated.View style={{ height: '100%', borderRadius: 999, backgroundColor: c.white, width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
          </View>
          <T s={12} color={c.onDarkMuted}>Finding tonight&apos;s events…</T>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
