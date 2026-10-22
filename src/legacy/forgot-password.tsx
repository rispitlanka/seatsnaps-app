import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { Banner } from "@/components/ui/Banner";
import { BrandHeader } from "@/components/ui/BrandHeader";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { forgotPassword } from "@/lib/api/auth";
import { toErrorMessage } from "@/lib/api/errors";
import { colors, spacing, typography } from "@/theme";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    const nextEmail = email.trim();
    if (!nextEmail) {
      setError("Enter the email on your SeatSnaps account.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await forgotPassword(nextEmail);
      router.push({
        pathname: "/(auth)/reset-password",
        params: { email: nextEmail },
      });
    } catch (caught) {
      setError(toErrorMessage(caught, "Could not send a reset code."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <BrandHeader
        showBack
        title="Reset your password"
        subtitle="We'll email a 6-digit code. It expires in 10 minutes."
      />
      <View style={styles.form}>
        {error ? <Banner message={error} /> : null}
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="done"
          onSubmitEditing={() => void onSubmit()}
        />
        <Text style={styles.hint}>Use the same email you sign in with.</Text>
      </View>
      <View style={styles.footer}>
        <Button label="Send code" onPress={() => void onSubmit()} loading={loading} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  hint: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  footer: {
    marginTop: "auto",
    paddingTop: spacing.xxxl,
  },
});
