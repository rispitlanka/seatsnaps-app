import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { isUiPreview, useSession } from '@/providers/session';
import { BackButton, PrimaryButton, Tap } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { CodeBoxes, IconTile, SettingsScreen } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** L2 Verify email (last sign-up step). The code is typed with the system keyboard / autofill. */
export default function VerifyEmail() {
  const { email = 'ramesh@example.com' } = useLocalSearchParams<{ email?: string }>();
  const { enterPreview } = useSession();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function verify() {
    if (code.length !== 6) return setError('Enter all six digits from the email.');
    // The API has no email-verification endpoint yet; preview builds continue into the app.
    if (isUiPreview) enterPreview();
    else router.replace('/login');
  }

  return (
    <SettingsScreen
      background={c.white}
      px={24}
      gap={20}
      back={
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <BackButton />
          <View style={{ flex: 1, gap: 6 }}>
            <T w={700} s={12} color={c.muted}>Last step · Verify email</T>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {[0, 1, 2].map(i => <View key={i} style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: c.blue }} />)}
            </View>
          </View>
        </View>
      }
    >
      <View style={{ marginTop: 6 }}>
        <IconTile icon="mail" />
      </View>
      <View style={{ gap: 12 }}>
        <Display>{'Confirm your\n'}<Hl>email.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>
          Enter the 6-digit code we sent to <T w={700} s={14}>{email}</T>.{' '}
          <T w={700} s={14} color={c.blue} onPress={() => router.back()}>Wrong email?</T>
        </T>
      </View>

      <View style={{ gap: 10 }}>
        <T w={600} s={14}>Verification code</T>
        <View>
          <CodeBoxes code={code} />
          <TextInput
            accessibilityLabel="Email verification code"
            value={code}
            onChangeText={v => setCode(v.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            caretHidden
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.02, color: 'transparent' }}
          />
        </View>
        <T s={12} color={c.muted}>Codes fill in automatically from the email on most phones.</T>
      </View>

      <Tap accessibilityRole="button" style={{ height: 50, borderRadius: 999, borderWidth: 1, borderColor: c.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Icon name="external" size={18} color={c.blue} />
        <T w={700} s={15}>Open email app</T>
      </Tap>

      {error ? <T s={13} color={c.error} accessibilityRole="alert">{error}</T> : null}

      <View style={{ marginTop: 'auto', gap: 10 }}>
        <PrimaryButton label="Verify & continue" onPress={verify} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <T s={14} color={c.ink2}>Didn&apos;t get it? </T>
          <Tap accessibilityRole="button">
            <T w={700} s={14} color={c.blue}>Resend code</T>
          </Tap>
        </View>
      </View>
    </SettingsScreen>
  );
}
