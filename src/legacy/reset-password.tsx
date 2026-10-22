import { useRef, useState } from "react";
import { StyleSheet, Text, type TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";

import { Banner } from "@/components/ui/Banner";
import { BrandHeader } from "@/components/ui/BrandHeader";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/ui/OtpInput";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { resetPassword } from "@/lib/api/auth";
import { toErrorMessage } from "@/lib/api/errors";
import { colors, spacing, typography } from "@/theme";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const passwordRef = useRef<TextInput>(null);
  const email = typeof params.email === "string" ? params.email : "";
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | undefined>();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!email) {
      setError("Start from the previous screen so we know which email to reset.");
      return;
    }
    if (otp.length !== 6) {
      setOtpError("Enter the 6-digit code from your email.");
      return;
    }
    if (password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    setOtpError(undefined);
    try {
      await resetPassword(email, otp, password);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setDone(true);
    } catch (caught) {
      setError(toErrorMessage(caught, "Could not reset your password."));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <Screen>
        <BrandHeader
          title="Password updated"
          subtitle="Sign in with your new password to keep booking."
        />
        <Banner tone="success" message="Your password has been reset successfully." />
        <View style={styles.footer}>
          <Button
            label="Back to sign in"
            onPress={() => router.replace("/(auth)/login")}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <BrandHeader
        showBack
        title="Enter your code"
        subtitle={`We sent a 6-digit code to ${email || "your email"}.`}
      />
      <View style={styles.form}>
        {error ? <Banner message={error} /> : null}
        <View style={styles.otpBlock}>
          <Text style={styles.label}>One-time code</Text>
          <OtpInput value={otp} onChange={setOtp} error={otpError} />
        </View>
        <TextField
          ref={passwordRef}
          label="New password"
          value={password}
          onChangeText={setPassword}
          isPassword
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="done"
          onSubmitEditing={() => void onSubmit()}
        />
      </View>
      <View style={styles.footer}>
        <Button label="Reset password" onPress={() => void onSubmit()} loading={loading} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.xl,
  },
  otpBlock: {
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "600",
  },
  footer: {
    marginTop: "auto",
    paddingTop: spacing.xxxl,
  },
});
