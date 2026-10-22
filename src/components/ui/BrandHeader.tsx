import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

import { colors, spacing, typography } from "@/theme";

type BrandHeaderProps = {
  title: string;
  subtitle: string;
  showBack?: boolean;
};

export function BrandHeader({ title, subtitle, showBack = false }: BrandHeaderProps) {
  return (
    <View style={styles.wrap}>
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          hitSlop={8}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
      ) : null}
      <View style={styles.markWrap}>
        <LinearGradient
          colors={["rgba(31, 115, 255, 0.32)", "rgba(31, 115, 255, 0)"]}
          style={styles.glow}
        />
        <Text style={styles.wordmark}>SeatSnaps</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    marginLeft: -spacing.sm,
    marginBottom: spacing.sm,
  },
  backLabel: {
    ...typography.body,
    color: colors.foreground,
  },
  markWrap: {
    marginBottom: spacing.md,
  },
  glow: {
    position: "absolute",
    width: 160,
    height: 80,
    top: -24,
    left: -24,
    borderRadius: 80,
  },
  wordmark: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.accent,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    ...typography.display,
    color: colors.foreground,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSubtle,
    maxWidth: 320,
  },
});
