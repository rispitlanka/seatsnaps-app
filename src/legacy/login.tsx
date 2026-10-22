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

export default function LoginScreen() {
  const { signIn } = useSession();
  const passwordRef = useRef<TextInput>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    const nextUsername = username.trim();
    if (!nextUsername || !password) {
      setError("Enter your email or username and password.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signIn(nextUsername, password);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (caught) {
      setError(toErrorMessage(caught, "Could not sign in."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <BrandHeader
        title="Welcome back"
        subtitle="Sign in to book events, movies, and experiences."
      />
      <View style={styles.form}>
        {error ? <Banner message={error} /> : null}
        <TextField
          label="Email or username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="username"
          autoComplete="username"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextField
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={setPassword}
          isPassword
          textContentType="password"
          autoComplete="password"
          returnKeyType="done"
          onSubmitEditing={() => void onSubmit()}
        />
        <Link href="/(auth)/forgot-password" asChild>
          <Pressable style={styles.forgot}>
            <Text style={styles.forgotLabel}>Forgot password?</Text>
          </Pressable>
        </Link>
      </View>
      <View style={styles.footer}>
        <Button label="Sign in" onPress={() => void onSubmit()} loading={loading} />
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>New to SeatSnaps?</Text>
          <Link href="/(auth)/signup" asChild>
            <Pressable hitSlop={8}>
              <Text style={styles.switchLink}>Create an account</Text>
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
  forgot: {
    alignSelf: "flex-end",
    minHeight: 44,
    justifyContent: "center",
  },
  forgotLabel: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: "600",
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
