import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";

import { colors, radii, spacing, typography } from "@/theme";

type ButtonVariant = "accent" | "secondary" | "ghost" | "quiet";

type ButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "accent",
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const handlePress = useCallback(() => {
    if (isDisabled) {
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [isDisabled, onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !isDisabled && pressedStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "accent" ? colors.white : colors.accent}
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === "accent" ? styles.labelOnAccent : styles.labelOnMuted,
            variant === "quiet" && styles.labelQuiet,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.body,
    fontWeight: "600",
  },
  labelOnAccent: {
    color: colors.white,
  },
  labelOnMuted: {
    color: colors.accent,
  },
  labelQuiet: {
    color: colors.textSubtle,
    fontWeight: "400",
  },
});

const variantStyles = StyleSheet.create({
  accent: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.accentMuted,
    borderWidth: 1,
    borderColor: "rgba(31, 115, 255, 0.05)",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  quiet: {
    backgroundColor: "transparent",
  },
});

const pressedStyles = StyleSheet.create({
  accent: {
    backgroundColor: colors.accentPressed,
  },
  secondary: {
    backgroundColor: "rgba(31, 115, 255, 0.18)",
  },
  ghost: {
    opacity: 0.7,
  },
  quiet: {
    opacity: 0.7,
  },
});
