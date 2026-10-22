import { forwardRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors, radii, spacing, typography } from "@/theme";

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  isPassword?: boolean;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(
  function TextField(
    { label, error, isPassword, style, onFocus, onBlur, ...rest },
    ref,
  ) {
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(isPassword ?? false);

    return (
      <View style={styles.wrap}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.field,
            focused && styles.fieldFocused,
            error ? styles.fieldError : null,
          ]}
        >
          <TextInput
            ref={ref}
            {...rest}
            style={[styles.input, style]}
            placeholderTextColor={colors.textSubtle}
            secureTextEntry={hidden}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
          />
          {isPassword ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={hidden ? "Show password" : "Hide password"}
              hitSlop={8}
              onPress={() => setHidden((value) => !value)}
              style={styles.iconButton}
            >
              <Ionicons
                name={hidden ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.textSubtle}
              />
            </Pressable>
          ) : null}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "600",
  },
  field: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  fieldFocused: {
    borderColor: colors.accent,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.foreground,
    paddingVertical: spacing.md,
  },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
});
