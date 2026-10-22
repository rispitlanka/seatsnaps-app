import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { toErrorMessage } from '@/lib/api/errors';
import { isUiPreview, useSession } from '@/providers/session';
import { FormScreen, SignupHeader } from '@/ui/auth';
import { Checkbox, EyeToggle, Field, PrimaryButton, Tap } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { passwordStrength, strengthWords } from '@/ui/password';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const COUNTRIES = ['Sri Lanka', 'Canada', 'India', 'United Kingdom'];

/** A5 Create account · 2 */
export default function SignupStepTwo() {
  const about = useLocalSearchParams<{ first?: string; last?: string; username?: string; phone?: string; email?: string }>();
  const { signUp } = useSession();
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [picking, setPicking] = useState(false);
  const [city, setCity] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const score = passwordStrength(pw);
  const barColor = score <= 1 ? c.danger : score === 2 ? c.warn : c.blue;

  async function create() {
    if (pw.length < 8) return setError('Use a password with at least 8 characters.');
    if (pw !== confirm) return setError('The passwords do not match.');
    if (!agreed) return setError('Accept the Terms and Privacy Policy to continue.');
    if (isUiPreview) return router.push({ pathname: '/verify-email', params: { email: String(about.email || 'ramesh@example.com') } });
    setLoading(true);
    setError('');
    try {
      await signUp({
        email: String(about.email ?? '').trim(),
        password: pw,
        firstName: about.first || undefined,
        lastName: about.last || undefined,
        phone: about.phone ? `+94${about.phone.replace(/\D/g, '')}` : undefined,
      });
    } catch (caught) {
      setError(toErrorMessage(caught, 'Could not create your account.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormScreen gap={16}>
      <SignupHeader step={2} label="Location & security" />
      <View style={{ gap: 12, marginTop: 6 }}>
        <Display>Almost <Hl>there.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>We use your city to show events near you first.</T>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1, gap: 6 }}>
          <T w={600} s={13}>Country</T>
          <Tap
            accessibilityRole="button"
            accessibilityLabel={`Country, ${country}`}
            onPress={() => setPicking(true)}
            style={{ height: 50, paddingLeft: 14, paddingRight: 14, backgroundColor: c.field, borderWidth: 1, borderColor: c.line, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <T s={15} numberOfLines={1} style={{ flexShrink: 1 }}>{country}</T>
            <Icon name="chevronDown" size={16} color={c.muted} stroke={2.4} />
          </Tap>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="City" placeholder="Colombo" autoComplete="postal-address-locality" value={city} onChangeText={setCity} />
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <Field
          label="Password"
          height={52}
          placeholder="At least 8 characters"
          secureTextEntry={!showPw}
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          value={pw}
          onChangeText={setPw}
          trailing={<EyeToggle shown={showPw} onToggle={() => setShowPw(v => !v)} />}
        />
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: pw && i <= score ? barColor : c.line }} />
          ))}
        </View>
        <T s={12} color={c.muted}>{pw ? strengthWords[score] : 'Use 8+ characters with a number and a symbol.'}</T>
      </View>

      <Field label="Confirm password" placeholder="Re-enter password" secureTextEntry autoCapitalize="none" autoComplete="new-password" value={confirm} onChangeText={setConfirm} />

      <Checkbox checked={agreed} onChange={setAgreed}>
        <T s={13} lh={1.45} color={c.ink2}>
          I agree to the <T w={700} s={13} color={c.blue} onPress={() => router.push('/legal')}>Terms</T> and <T w={700} s={13} color={c.blue} onPress={() => router.push({ pathname: '/legal', params: { tab: 'privacy' } })}>Privacy Policy</T>.
        </T>
      </Checkbox>

      {error ? <T s={13} color={c.danger} accessibilityRole="alert">{error}</T> : null}

      <PrimaryButton label={loading ? 'Creating account…' : 'Create account'} onPress={create} disabled={loading} style={{ marginTop: 'auto' }} />

      <Modal visible={picking} transparent animationType="fade" onRequestClose={() => setPicking(false)}>
        <Pressable accessibilityLabel="Close" onPress={() => setPicking(false)} style={{ flex: 1, backgroundColor: 'rgba(10,17,48,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: c.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 10, paddingBottom: 30, paddingHorizontal: 20 }}>
            <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 999, backgroundColor: c.dot, marginBottom: 14 }} />
            {COUNTRIES.map(option => (
              <Tap
                key={option}
                accessibilityRole="radio"
                accessibilityState={{ selected: option === country }}
                onPress={() => {
                  setCountry(option);
                  setPicking(false);
                }}
                style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: c.lineSoft }}
              >
                <T w={option === country ? 800 : 600} s={15}>{option}</T>
                {option === country ? <Icon name="check" size={18} color={c.blue} stroke={2.6} /> : null}
              </Tap>
            ))}
          </View>
        </Pressable>
      </Modal>
    </FormScreen>
  );
}
