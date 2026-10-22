import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "@/theme";

type QtyStepperProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
};

export function QtyStepper({ value, max, onChange }: QtyStepperProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        disabled={value <= 0}
        onPress={() => onChange(Math.max(0, value - 1))}
        style={[styles.btn, value <= 0 && styles.disabled]}
      >
        <Text style={styles.btnLabel}>−</Text>
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        disabled={value >= max}
        onPress={() => onChange(Math.min(max, value + 1))}
        style={[styles.btn, value >= max && styles.disabled]}
      >
        <Text style={styles.btnLabel}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.accentMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  btnLabel: {
    ...typography.title,
    color: colors.accent,
  },
  value: {
    ...typography.title,
    color: colors.foreground,
    minWidth: 28,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
});
