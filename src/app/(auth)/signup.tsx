import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { FormScreen, SignupHeader } from '@/ui/auth';
import { Field, GoogleButton, OrDivider, PrimaryButton, Tap } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** A4 Create account · 1 */
export default function SignupStepOne() {
  const [form, setForm] = useState({ first: '', last: '', username: '', phone: '', email: '' });
  const [error, setError] = useState('');
  const set = (key: keyof typeof form) => (value: string) => setForm(f => ({ ...f, [key]: value }));

  function next() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Enter a valid email address to continue.');
    setError('');
    router.push({ pathname: '/signup-details', params: form });
  }

  return (
    <FormScreen gap={14}>
      <SignupHeader step={1} label="About you" />
      <View style={{ gap: 12, marginTop: 6 }}>
        <Display>Create <Hl>account.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>Join SeatSnaps to discover events and keep every ticket in one place.</T>
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Field label="First name" placeholder="John" autoComplete="given-name" textContentType="givenName" value={form.first} onChangeText={set('first')} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Last name" placeholder="Doe" autoComplete="family-name" textContentType="familyName" value={form.last} onChangeText={set('last')} />
        </View>
      </View>
      <Field label="Username" height={52} prefix="@" placeholder="johndoe" autoCapitalize="none" autoCorrect={false} autoComplete="username" value={form.username} onChangeText={set('username')} />
      <Field label="Phone" height={52} segment="+94" placeholder="77 123 4567" keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" value={form.phone} onChangeText={set('phone')} />
      <Field label="Email" placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" value={form.email} onChangeText={set('email')} />
      {error ? <T s={13} color={c.danger} accessibilityRole="alert">{error}</T> : null}
      <PrimaryButton label="Continue" onPress={next} style={{ marginTop: 4 }} />
      <OrDivider />
      <GoogleButton height={54} />
      <View style={{ marginTop: 'auto', paddingTop: 14, flexDirection: 'row', justifyContent: 'center' }}>
        <T s={14} color={c.ink2}>Already have an account? </T>
        <Tap accessibilityRole="link" onPress={() => router.replace('/login')}>
          <T w={700} s={14} color={c.blue}>Sign in</T>
        </Tap>
      </View>
    </FormScreen>
  );
}
