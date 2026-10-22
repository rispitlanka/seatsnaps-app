import { useRef, useState } from "react";
import { StyleSheet, type TextInput, View } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { updateMe } from "@/lib/api/auth";
import { toErrorMessage } from "@/lib/api/errors";
import { useSession } from "@/providers/session";
import { spacing } from "@/theme";

export default function EditProfileScreen() {
  const { user, setUser } = useSession();
  const lastNameRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const countryRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [country, setCountry] = useState(user?.country ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    setError(null);
    try {
      const next = await updateMe({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim() || undefined,
        email: email.trim(),
        phone: phone.trim() || undefined,
        country: country.trim() || undefined,
        city: city.trim() || undefined,
      });
      setUser(next);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({ pathname: "/account", params: { notice: "profile" } });
    } catch (caught) {
      setError(toErrorMessage(caught, "Could not save your profile."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen edges={["bottom"]} keyboardVerticalOffset={8}>
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
              returnKeyType="next"
              onSubmitEditing={() => usernameRef.current?.focus()}
            />
          </View>
        </View>
        <TextField
          ref={usernameRef}
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="username"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <TextField
          ref={emailRef}
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
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
          returnKeyType="next"
          onSubmitEditing={() => countryRef.current?.focus()}
        />
        <TextField
          ref={countryRef}
          label="Country"
          value={country}
          onChangeText={setCountry}
          autoCapitalize="words"
          textContentType="countryName"
          returnKeyType="next"
          onSubmitEditing={() => cityRef.current?.focus()}
        />
        <TextField
          ref={cityRef}
          label="City"
          value={city}
          onChangeText={setCity}
          autoCapitalize="words"
          textContentType="addressCity"
          returnKeyType="done"
          onSubmitEditing={() => void onSubmit()}
        />
      </View>
      <View style={styles.footer}>
        <Button label="Save changes" onPress={() => void onSubmit()} loading={loading} />
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
  footer: {
    marginTop: "auto",
    paddingTop: spacing.xxxl,
  },
});
