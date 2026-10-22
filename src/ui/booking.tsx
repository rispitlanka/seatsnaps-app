import { useCallback, type ReactNode } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { View } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { StatusBar } from 'expo-status-bar';

import { useCountdown } from '@/hooks/useCountdown';
import { useCart } from '@/providers/cart';

import { BackButton, BookingSteps, TimerPill, useTopPad } from './components';
import { T } from './Text';
import { c } from './tokens';

/** Live hold countdown pill shown on seats and checkout. */
export function HoldTimer() {
  const { holdUntil } = useCart();
  const ms = useCountdown(holdUntil);
  const expired = !!holdUntil && ms <= 0 && Date.parse(holdUntil) <= Date.now();
  // Only the screen on top reacts, so a seat map further back can't navigate.
  useFocusEffect(
    useCallback(() => {
      if (expired) router.replace('/booking/expired');
    }, [expired]),
  );
  if (!holdUntil) return null;
  const total = Math.ceil(ms / 1000);
  const label = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  return <TimerPill label={label} />;
}

/** White header used by the ticket → seats → checkout flow. */
export function BookingHeader({
  title,
  subtitle,
  thumb,
  step,
  timer,
  titleSize = 15,
  steps,
  children,
}: {
  title: string;
  subtitle?: string;
  thumb?: ImageSource;
  step: number;
  steps?: string[];
  timer?: boolean;
  titleSize?: number;
  children?: ReactNode;
}) {
  const top = useTopPad();
  return (
    <View style={{ backgroundColor: c.white, paddingTop: top, paddingHorizontal: 20, paddingBottom: 16, gap: 16, borderBottomWidth: 1, borderBottomColor: c.line }}>
      <StatusBar style="dark" />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <BackButton />
        {thumb ? <Image source={thumb} style={{ width: 44, height: 44, borderRadius: 12 }} /> : null}
        <View style={{ flex: 1, gap: 1 }}>
          <T w={800} s={titleSize}>{title}</T>
          {subtitle ? <T s={12} color={c.muted}>{subtitle}</T> : null}
        </View>
        {timer ? <HoldTimer /> : null}
        {children}
      </View>
      <BookingSteps step={step} labels={steps} />
    </View>
  );
}
