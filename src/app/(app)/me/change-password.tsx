import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { changePassword } from '@/lib/api/auth';
import { toErrorMessage } from '@/lib/api/errors';
import { isUiPreview } from '@/providers/session';
import { Checkbox, Field, PrimaryButton, Tap } from '@/ui/components';
import { SettingsScreen } from '@/ui/settings';
import { passwordStrength, strengthWords } from '@/ui/password';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** G4 Change password. */
export default function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [signOutOthers, setSignOutOthers] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const score = passwordStrength(next);

  async function submit() {
    if (!current) return setError('Enter your current password.');
    if (next.length < 8) return setError('Use a password with at least 8 characters.');
    if (next !== confirm) return setError('The new passwords do not match.');
    setSaving(true);
    setError('');
    try {
      if (!isUiPreview) await changePassword(current, next);
      router.back();
    } catch (caught) {
      setError(toErrorMessage(caught, 'Could not change your password.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsScreen>
      <Display>Change <Hl>password.</Hl></Display>

      <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, padding: 16, gap: 14 }}>
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <T w={600} s={13}>Current password</T>
            <Tap accessibilityRole="link" onPress={() => router.push('/forgot-password')}>
              <T w={700} s={13} color={c.blue}>Forgot?</T>
            </Tap>
          </View>
          <Field height={48} accessibilityLabel="Current password" placeholder="Current password" secureTextEntry autoCapitalize="none" autoComplete="current-password" value={current} onChangeText={setCurrent} />
        </View>
        <View style={{ gap: 6 }}>
          <Field label="New password" height={48} placeholder="At least 8 characters" secureTextEntry autoCapitalize="none" autoComplete="new-password" value={next} onChangeText={setNext} />
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: next && i <= score ? (score <= 1 ? c.danger : score === 2 ? c.warn : c.blue) : c.line }} />
            ))}
          </View>
          <T s={12} color={c.muted}>{next ? strengthWords[score] : 'Use 8+ characters with a number and a symbol.'}</T>
        </View>
        <Field label="Confirm new password" height={48} placeholder="Re-enter password" secureTextEntry autoCapitalize="none" autoComplete="new-password" value={confirm} onChangeText={setConfirm} />
      </View>

      <Checkbox checked={signOutOthers} onChange={setSignOutOthers}>
        <T s={13} lh={1.5} color={c.ink2}>Sign me out on other devices</T>
      </Checkbox>

      {error ? <T s={13} color={c.error} accessibilityRole="alert">{error}</T> : null}
      <PrimaryButton label={saving ? 'Updating…' : 'Update password'} disabled={saving} onPress={submit} style={{ marginTop: 'auto' }} />
    </SettingsScreen>
  );
}
