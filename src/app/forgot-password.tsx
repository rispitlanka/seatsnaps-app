import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { forgotPassword } from '@/lib/api/auth';
import { toErrorMessage } from '@/lib/api/errors';
import { isUiPreview } from '@/providers/session';
import { Field, PrimaryButton, Segmented, Tap, goBack } from '@/ui/components';
import { IconTile, SettingsScreen } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** G1 Forgot password. */
export default function ForgotPassword() {
  const [mode, setMode] = useState('Email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function send() {
    if (mode === 'Phone') return setError("Phone reset isn't available yet — use the email on your account.");
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return setError('Enter a valid email address.');
    setSending(true);
    setError('');
    try {
      if (!isUiPreview) await forgotPassword(value);
      router.push({ pathname: '/verify-code', params: { email: value } });
    } catch (caught) {
      setError(toErrorMessage(caught, 'Could not send the code.'));
    } finally {
      setSending(false);
    }
  }

  return (
    <SettingsScreen background={c.white} px={24} gap={22}>
      <IconTile icon="lock" />
      <View style={{ gap: 12 }}>
        <Display>{'Forgot your\n'}<Hl>password?</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>Enter the email or phone number on your account. We&apos;ll send you a 6-digit code.</T>
      </View>

      <Segmented options={['Email', 'Phone']} value={mode} onChange={setMode} background={c.segmentAlt} />

      {mode === 'Email' ? (
        <Field label="Email" labelSize={14} height={52} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" value={email} onChangeText={setEmail} returnKeyType="send" onSubmitEditing={send} />
      ) : (
        <Field label="Phone" labelSize={14} height={54} segment="+94" placeholder="77 123 4567" keyboardType="phone-pad" autoComplete="tel" value={phone} onChangeText={setPhone} />
      )}

      {error ? <T s={13} color={c.error} accessibilityRole="alert">{error}</T> : null}

      <PrimaryButton label={sending ? 'Sending…' : 'Send code'} disabled={sending} onPress={send} style={{ marginTop: 'auto' }} />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <T s={14} color={c.ink2}>Remembered it? </T>
        <Tap accessibilityRole="link" onPress={() => goBack('/login')}>
          <T w={700} s={14} color={c.blue}>Sign in</T>
        </Tap>
      </View>
    </SettingsScreen>
  );
}
