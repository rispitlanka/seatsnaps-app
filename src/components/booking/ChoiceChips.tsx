import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "@/theme";

type ChoiceChipsProps = {
  options: string[];
  value?: string | string[];
  multiple?: boolean;
  onChange: (value: string | string[]) => void;
};

export function ChoiceChips({ options, value, multiple = false, onChange }: ChoiceChipsProps) {
  const selected = new Set(Array.isArray(value) ? value : value ? [value] : []);

  function toggle(option: string) {
    if (multiple) {
      const next = new Set(selected);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      onChange([...next]);
      return;
    }
    onChange(option);
  }

  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const active = selected.has(option);
        return (
          <Pressable
            key={option}
            onPress={() => toggle(option)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accent,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "600",
  },
  labelActive: {
    color: colors.accent,
  },
});
