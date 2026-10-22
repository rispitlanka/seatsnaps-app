import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { resetPassword } from '@/lib/api/auth';
import { toErrorMessage } from '@/lib/api/errors';
import { isUiPreview, useSession } from '@/providers/session';
import { Field, PrimaryButton } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { SettingsScreen } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function Rule({ met, label }: { met: boolean; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Icon name={met ? 'check' : 'dot'} size={15} color={met ? c.success : c.muted} stroke={met ? 3 : 2.4} />
      <T w={met ? 700 : 400} s={13} color={met ? c.success : c.muted}>{label}</T>
    </View>
  );
}

/** G3 New password (shows the mismatch error state live). */
export default function ResetPassword() {
  const { email = '', code = '' } = useLocalSearchParams<{ email?: string; code?: string }>();
  const { session, signIn, enterPreview } = useSession();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const mismatch = confirm.length > 0 && confirm !== pw;

  async function save() {
    if (pw.length < 8) return setError('Use a password with at least 8 characters.');
    if (pw !== confirm) return;
    setSaving(true);
    setError('');
    try {
      if (isUiPreview) {
        if (!session) enterPreview();
      } else {
        await resetPassword(email, code, pw);
        if (!session) await signIn(email, pw);
      }
      if (session) router.dismissTo('/me/security');
      else router.replace('/');
    } catch (caught) {
      setError(toErrorMessage(caught, 'Could not reset your password.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsScreen background={c.white} px={24} gap={22}>
      <View style={{ gap: 12 }}>
        <Display>{'New\n'}<Hl>password.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>Pick something you haven&apos;t used on SeatSnaps before.</T>
      </View>

      <Field label="New password" labelSize={14} height={52} placeholder="At least 8 characters" secureTextEntry autoCapitalize="none" autoComplete="new-password" value={pw} onChangeText={setPw} />
      <View style={{ gap: 8 }}>
        <Field
          label="Confirm new password"
          labelSize={14}
          height={52}
          invalid={mismatch}
          placeholder="Re-enter password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          value={confirm}
          onChangeText={setConfirm}
        />
        {mismatch ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} accessibilityRole="alert">
            <Icon name="alert" size={15} color={c.error} stroke={2.4} />
            <T w={700} s={13} color={c.error}>Passwords don&apos;t match</T>
          </View>
        ) : null}
      </View>

      <View style={{ backgroundColor: c.page, borderRadius: 16, padding: 14, gap: 8 }}>
        <Rule met={pw.length >= 8} label="8 or more characters" />
        <Rule met={/\d/.test(pw)} label="A number" />
        <Rule met={/[^A-Za-z0-9]/.test(pw)} label="A symbol (! @ # …)" />
      </View>

      {error ? <T s={13} color={c.error} accessibilityRole="alert">{error}</T> : null}
      <PrimaryButton label={saving ? 'Saving…' : 'Save and sign in'} disabled={saving} onPress={save} style={{ marginTop: 'auto' }} />
    </SettingsScreen>
  );
}
