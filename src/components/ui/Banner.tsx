import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "@/theme";

type BannerProps = {
  message: string;
  tone?: "error" | "success";
};

export function Banner({ message, tone = "error" }: BannerProps) {
  return (
    <View
      style={[
        styles.banner,
        tone === "success" ? styles.success : styles.error,
      ]}
    >
      <Text
        style={[
          styles.text,
          tone === "success" ? styles.successText : styles.errorText,
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
  },
  error: {
    backgroundColor: "rgba(248, 113, 113, 0.12)",
    borderColor: "rgba(248, 113, 113, 0.28)",
  },
  success: {
    backgroundColor: "rgba(52, 211, 153, 0.12)",
    borderColor: "rgba(52, 211, 153, 0.28)",
  },
  text: {
    ...typography.caption,
  },
  errorText: {
    color: colors.danger,
  },
  successText: {
    color: colors.success,
  },
});
