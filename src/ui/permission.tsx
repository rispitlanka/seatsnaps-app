import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import { img } from './assets';
import { PrimaryButton, TextButton, useBottomPad } from './components';
import { Display, T } from './Text';
import { c } from './tokens';

/** Permission prompt layout (G5, G7): 420pt blue hero, copy and two actions. */
export function PermissionScreen({
  hero,
  heroStyle,
  watermark,
  title,
  body,
  primary,
  onPrimary,
  secondary,
  onSecondary,
}: {
  hero: ReactNode;
  heroStyle?: object;
  watermark: { left?: number; right?: number; bottom: number };
  title: ReactNode;
  body: string;
  primary: string;
  onPrimary: () => void;
  secondary: string;
  onSecondary: () => void;
}) {
  const bottom = useBottomPad(34);
  return (
    <View style={{ flex: 1, backgroundColor: c.white }}>
      <StatusBar style="light" />
      <LinearGradient colors={[c.heroTop, c.heroBottom]} style={{ height: 420, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', ...heroStyle }}>
        <Image source={img.watermark} style={{ position: 'absolute', width: 380, height: 380, opacity: 0.08, ...watermark }} />
        {hero}
      </LinearGradient>
      <View style={{ flex: 1, paddingTop: 30, paddingHorizontal: 24, paddingBottom: bottom, gap: 12 }}>
        <Display style={{ marginTop: 8 }}>{title}</Display>
        <T s={15} lh={1.5} color={c.ink2}>{body}</T>
        <View style={{ marginTop: 'auto', gap: 6 }}>
          <PrimaryButton label={primary} onPress={onPrimary} />
          <TextButton label={secondary} onPress={onSecondary} />
        </View>
      </View>
    </View>
  );
}
