import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { updateMe } from '@/lib/api/auth';
import { toErrorMessage } from '@/lib/api/errors';
import { isUiPreview, useSession } from '@/providers/session';
import { Avatar, Field, PrimaryButton, Tap } from '@/ui/components';
import { SettingsScreen } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** E7 Account settings. */
export default function AccountSettings() {
  const { user, setUser } = useSession();
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    username: user?.username ?? '',
    email: user?.email ?? '',
    phone: (user?.phone ?? '').replace(/^\+94/, ''),
    country: user?.country ?? '',
    city: user?.city ?? '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (key: keyof typeof form) => (value: string) => setForm(f => ({ ...f, [key]: value }));
  const initials = `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase() || 'RR';

  async function save() {
    if (!user) return;
    const payload = {
      ...form,
      phone: form.phone ? `+94${form.phone.replace(/\D/g, '')}` : undefined,
    };
    setSaving(true);
    setError('');
    try {
      setUser(isUiPreview ? { ...user, ...payload } : await updateMe(payload));
      router.back();
    } catch (caught) {
      setError(toErrorMessage(caught, 'Could not save your changes.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsScreen>
      <Display>Account <Hl>settings.</Hl></Display>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Avatar initials={initials} size={64} bg={c.blue} textSize={20} />
        <Tap accessibilityRole="button" onPress={() => router.push('/photo')} style={{ height: 40, paddingHorizontal: 16, borderRadius: 999, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, justifyContent: 'center' }}>
          <T w={700} s={14}>Change photo</T>
        </Tap>
      </View>

      <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, padding: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Field label="First name" height={48} placeholder="Ramesh" autoComplete="given-name" value={form.firstName} onChangeText={set('firstName')} />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Last name" height={48} placeholder="Ram" autoComplete="family-name" value={form.lastName} onChangeText={set('lastName')} />
          </View>
        </View>
        <Field label="Username" height={48} placeholder="@rameshram" autoCapitalize="none" autoCorrect={false} autoComplete="username" value={form.username} onChangeText={set('username')} />
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <T w={600} s={13}>Email</T>
            <T w={800} s={12} color={c.success}>Verified</T>
          </View>
          <Field height={48} accessibilityLabel="Email" placeholder="ramesh@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" value={form.email} onChangeText={set('email')} />
        </View>
        <Field label="Phone" height={50} segment="+94" placeholder="77 123 4567" keyboardType="phone-pad" autoComplete="tel" value={form.phone} onChangeText={set('phone')} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Field label="Country" height={48} placeholder="Sri Lanka" autoComplete="country" value={form.country} onChangeText={set('country')} />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="City" height={48} placeholder="Colombo" autoComplete="postal-address-locality" value={form.city} onChangeText={set('city')} />
          </View>
        </View>
      </View>

      {error ? <T s={13} color={c.error} accessibilityRole="alert">{error}</T> : null}
      <PrimaryButton label={saving ? 'Saving…' : 'Save changes'} disabled={saving} onPress={save} />
    </SettingsScreen>
  );
}
