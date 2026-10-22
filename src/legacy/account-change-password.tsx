import { useRef, useState } from "react";
import { StyleSheet, type TextInput, View } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { changePassword } from "@/lib/api/auth";
import { toErrorMessage } from "@/lib/api/errors";
import { useSession } from "@/providers/session";
import { spacing } from "@/theme";

export default function ChangePasswordScreen() {
  const { user, signIn } = useSession();
  const newPasswordRef = useRef<TextInput>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!oldPassword || !newPassword) {
      setError("Enter your current password and a new one.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (!user?.email) {
      setError("Your account is missing an email. Sign in again.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await changePassword(oldPassword, newPassword);
      await signIn(user.email, newPassword);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({ pathname: "/account", params: { notice: "password" } });
    } catch (caught) {
      setError(toErrorMessage(caught, "Could not change your password."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen edges={["bottom"]} keyboardVerticalOffset={8}>
      <View style={styles.form}>
        {error ? <Banner message={error} /> : null}
        <TextField
          label="Current password"
          value={oldPassword}
          onChangeText={setOldPassword}
          isPassword
          textContentType="password"
          autoComplete="password"
          returnKeyType="next"
          onSubmitEditing={() => newPasswordRef.current?.focus()}
        />
        <TextField
          ref={newPasswordRef}
          label="New password"
          value={newPassword}
          onChangeText={setNewPassword}
          isPassword
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="done"
          onSubmitEditing={() => void onSubmit()}
        />
      </View>
      <View style={styles.footer}>
        <Button label="Update password" onPress={() => void onSubmit()} loading={loading} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  footer: {
    marginTop: "auto",
    paddingTop: spacing.xxxl,
  },
});
