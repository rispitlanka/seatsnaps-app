import { StyleSheet, Text } from "react-native";

import { formatCountdown } from "@/lib/booking";
import { colors, typography } from "@/theme";

type CountdownProps = {
  remainingMs: number;
  label?: string;
};

export function Countdown({ remainingMs, label = "Held for" }: CountdownProps) {
  const expired = remainingMs <= 0;
  return (
    <Text style={[styles.text, expired && styles.expired]}>
      {expired ? "Hold expired" : `${label} ${formatCountdown(remainingMs)}`}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.body,
    fontWeight: "600",
    color: colors.accent,
    fontVariant: ["tabular-nums"],
  },
  expired: {
    color: colors.danger,
  },
});
