import { useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputKeyPressEvent,
} from "react-native";

import { colors, radii, spacing, typography } from "@/theme";

const OTP_LENGTH = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function OtpInput({ value, onChange, error }: OtpInputProps) {
  const refs = useRef<Array<TextInput | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? "");

  function setDigit(index: number, raw: string) {
    const cleaned = raw.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const next = cleaned.slice(0, OTP_LENGTH);
      onChange(next);
      const focusAt = Math.min(next.length, OTP_LENGTH - 1);
      refs.current[focusAt]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned;
    onChange(nextDigits.join(""));

    if (cleaned && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function onKeyPress(index: number, event: TextInputKeyPressEvent) {
    if (event.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      const nextDigits = [...digits];
      nextDigits[index - 1] = "";
      onChange(nextDigits.join(""));
      refs.current[index - 1]?.focus();
    }
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            value={digit}
            onChangeText={(text) => setDigit(index, text)}
            onKeyPress={(event) => onKeyPress(index, event)}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            maxLength={index === 0 ? OTP_LENGTH : 1}
            selectTextOnFocus
            style={[styles.box, error ? styles.boxError : null]}
          />
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  box: {
    flex: 1,
    minHeight: 52,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.foreground,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
  },
  boxError: {
    borderColor: colors.danger,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
});
