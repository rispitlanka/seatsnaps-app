import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { forgotPassword } from '@/lib/api/auth';
import { isUiPreview } from '@/providers/session';
import { PrimaryButton, Tap } from '@/ui/components';
import { CodeBoxes, IconTile, Keypad, SettingsScreen } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** "r•••@example.com" */
function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  return domain ? `${name.charAt(0)}•••@${domain}` : email;
}

/** G2 Verification code. The code is checked when the new password is saved (G3). */
export default function VerifyCode() {
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');
  const [wait, setWait] = useState(42);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait(w => w - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  const press = (key: string) => setCode(current => (key === '⌫' ? current.slice(0, -1) : current.length < 6 ? current + key : current));
  const resend = () => {
    if (!isUiPreview && email) void forgotPassword(email).catch(() => undefined);
    setWait(42);
  };

  return (
    <SettingsScreen background={c.white} px={24} gap={22}>
      <IconTile icon="mail" />
      <View style={{ gap: 12 }}>
        <Display>{'Check your\n'}<Hl>inbox.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>
          We sent a 6-digit code to <T w={700} s={14}>{maskEmail(email || 'ramesh@example.com')}</T>. It expires in 10 minutes.
        </T>
      </View>

      <View style={{ gap: 10 }}>
        <T w={600} s={14}>Verification code</T>
        <CodeBoxes code={code} />
      </View>

      <Keypad onKey={press} />

      <View style={{ marginTop: 'auto', gap: 10 }}>
        <PrimaryButton label="Verify" disabled={code.length !== 6} onPress={() => router.push({ pathname: '/reset-password', params: { email, code } })} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <T s={14} color={c.ink2}>Didn&apos;t get it? </T>
          {wait > 0 ? (
            <T w={700} s={14} color={c.subtle}>Resend in 0:{String(wait).padStart(2, '0')}</T>
          ) : (
            <Tap accessibilityRole="button" onPress={resend}>
              <T w={700} s={14} color={c.blue}>Resend code</T>
            </Tap>
          )}
        </View>
      </View>
    </SettingsScreen>
  );
}
