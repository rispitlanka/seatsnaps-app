import { useEffect, useRef } from 'react';
import { Animated, View, type ViewStyle } from 'react-native';

import { c } from './tokens';

/** Pulsing placeholder block used while a screen is loading. */
export function Skeleton({
  width = '100%',
  height,
  radius = 12,
  style,
}: {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  style?: ViewStyle;
}) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius: radius, backgroundColor: c.line, opacity }, style]}
    />
  );
}

export function SkeletonStack({ count = 3, height = 88, gap = 12, radius = 18 }: { count?: number; height?: number; gap?: number; radius?: number }) {
  return (
    <View style={{ gap }}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} height={height} radius={radius} />
      ))}
    </View>
  );
}
