import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, type TextInput, View } from "react-native";
import { Link } from "expo-router";
import * as Haptics from "expo-haptics";

import { Banner } from "@/components/ui/Banner";
import { BrandHeader } from "@/components/ui/BrandHeader";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { toErrorMessage } from "@/lib/api/errors";
import { useSession } from "@/providers/session";
import { colors, spacing, typography } from "@/theme";

export default function SignupScreen() {
  const { signUp } = useSession();
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    const nextEmail = email.trim();
    if (!nextEmail || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signUp({
        email: nextEmail,
        password,
        ...(firstName.trim() ? { firstName: firstName.trim() } : {}),
        ...(lastName.trim() ? { lastName: lastName.trim() } : {}),
        ...(phone.trim() ? { phone: phone.trim() } : {}),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (caught) {
      setError(toErrorMessage(caught, "Could not create your account."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <BrandHeader
        title="Create your account"
        subtitle="A few details now. Tickets, seats, and nights out later."
        showBack
      />
      <View style={styles.form}>
        {error ? <Banner message={error} /> : null}
        <View style={styles.row}>
          <View style={styles.half}>
            <TextField
              label="First name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              textContentType="givenName"
              autoComplete="given-name"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
          </View>
          <View style={styles.half}>
            <TextField
              ref={lastNameRef}
              label="Last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              textContentType="familyName"
              autoComplete="family-name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          </View>
        </View>
        <TextField
          ref={emailRef}
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
        />
        <TextField
          ref={phoneRef}
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextField
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={setPassword}
          isPassword
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="done"
          onSubmitEditing={() => void onSubmit()}
        />
        <Text style={styles.hint}>At least 6 characters. You can add more details later.</Text>
      </View>
      <View style={styles.footer}>
        <Button label="Create account" onPress={() => void onSubmit()} loading={loading} />
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Already have an account?</Text>
          <Link href="/(auth)/login" asChild>
            <Pressable hitSlop={8}>
              <Text style={styles.switchLink}>Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  half: {
    flex: 1,
  },
  hint: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  footer: {
    marginTop: "auto",
    paddingTop: spacing.xxxl,
    gap: spacing.lg,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: 44,
    alignItems: "center",
  },
  switchText: {
    ...typography.body,
    color: colors.textSubtle,
  },
  switchLink: {
    ...typography.body,
    color: colors.accent,
    fontWeight: "600",
  },
});
