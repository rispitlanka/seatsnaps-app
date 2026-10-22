import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, type TextInput } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

import { toErrorMessage } from '@/lib/api/errors';
import { isUiPreview, useSession } from '@/providers/session';
import { img } from '@/ui/assets';
import { EyeToggle, Field, GoogleButton, OrDivider, PrimaryButton, Tap, useBottomPad, useTopPad } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** A3 Sign in. */
export default function LoginScreen() {
  const { signIn, enterPreview } = useSession();
  const top = useTopPad(12);
  const bottom = useBottomPad();
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (isUiPreview) return enterPreview();
    if (!email.trim() || !password) return setError('Enter your email and password.');
    setLoading(true);
    setError('');
    try {
      await signIn(email.trim(), password);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (caught) {
      setError(toErrorMessage(caught, 'Could not sign in.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.night }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" bounces={false}>
        <LinearGradient colors={[c.heroTop, c.heroBottom]} style={{ height: 194 + top, paddingTop: top, paddingHorizontal: 24, gap: 26, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', top: -60, right: -90, width: 320, height: 320, borderRadius: 999, borderWidth: 40, borderColor: c.white, opacity: 0.07 }} />
          <Image source={img.wordmarkWhite} style={{ width: 158, height: 30 }} accessibilityLabel="SeatSnaps" />
          <View style={{ gap: 12 }}>
            <Display color={c.white} accent={c.blueSoftLine}>Welcome <Hl>back.</Hl></Display>
            <T s={14} lh={1.5} color={c.onDark}>Sign in to book seats and manage your tickets.</T>
          </View>
        </LinearGradient>

        <View style={{ flex: 1, marginTop: -24, backgroundColor: c.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 28, paddingHorizontal: 24, paddingBottom: bottom, gap: 16 }}>
          <Field
            label="Email"
            labelSize={14}
            height={54}
            icon="mail"
            placeholder="you@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="username"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <T w={600} s={14}>Password</T>
              <Tap accessibilityRole="link" hitSlop={8} onPress={() => router.push('/forgot-password')}>
                <T w={700} s={14} color={c.blue}>Forgot password?</T>
              </Tap>
            </View>
            <Field
              ref={passwordRef}
              height={54}
              icon="lock"
              placeholder="Enter your password"
              accessibilityLabel="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
              autoCapitalize="none"
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={submit}
              trailing={<EyeToggle shown={showPw} onToggle={() => setShowPw(v => !v)} />}
            />
          </View>

          {error ? <T s={13} color={c.danger} accessibilityRole="alert">{error}</T> : null}

          <PrimaryButton label={loading ? 'Signing in…' : 'Sign in'} onPress={submit} disabled={loading} style={{ marginTop: 6 }} />
          <OrDivider />
          <GoogleButton height={56} />

          <View style={{ marginTop: 'auto', paddingTop: 16, flexDirection: 'row', justifyContent: 'center' }}>
            <T s={14} color={c.ink2}>Don&apos;t have an account? </T>
            <Tap accessibilityRole="link" onPress={() => router.push('/signup')}>
              <T w={700} s={14} color={c.blue}>Sign up</T>
            </Tap>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
