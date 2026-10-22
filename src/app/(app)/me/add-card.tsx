import { useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { useSession } from '@/providers/session';
import { img } from '@/ui/assets';
import { Checkbox, Field, PrimaryButton } from '@/ui/components';
import { SettingsScreen } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function brandOf(digits: string) {
  if (digits[0] === '4') return 'VISA';
  if (digits[0] === '5') return 'MASTERCARD';
  if (digits[0] === '3') return 'AMEX';
  return 'CARD';
}

/** L3 Add a card. Card details aren't sent anywhere until a payment provider is connected. */
export default function AddCard() {
  const { user } = useSession();
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const digits = number.replace(/\D/g, '').slice(0, 16);
  const masked = (digits + '•'.repeat(16)).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const holder = (name || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Ramesh Ram').toUpperCase();

  return (
    <SettingsScreen>
      <Display>Add a <Hl>card.</Hl></Display>

      <LinearGradient colors={[c.heroTop, c.ink]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: 190, borderRadius: 24, padding: 20, justifyContent: 'space-between', overflow: 'hidden' }}>
        <Image source={img.watermark} style={{ position: 'absolute', width: 200, height: 200, right: -50, bottom: -60, opacity: 0.1 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ width: 40, height: 30, borderRadius: 6, backgroundColor: c.blueSoftLine }} />
          <T w={800} s={13} ls={0.08} color={c.white}>{brandOf(digits)}</T>
        </View>
        <T w={800} s={20} ls={0.12} color={c.white}>{masked}</T>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <T w={800} s={14} color={c.white}>{holder}</T>
          <T w={800} s={14} color={c.white}>MM/YY</T>
        </View>
      </LinearGradient>

      <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, padding: 16, gap: 14 }}>
        <Field label="Card number" height={48} placeholder="1234 5678 9012 3456" keyboardType="number-pad" autoComplete="cc-number" value={number} onChangeText={setNumber} style={{ letterSpacing: 0.6 }} />
        <Field label="Name on card" height={48} placeholder="As printed on the card" autoComplete="cc-name" autoCapitalize="characters" value={name} onChangeText={setName} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Field label="Expiry" height={48} placeholder="MM / YY" keyboardType="number-pad" autoComplete="cc-exp" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="CVC" height={48} placeholder="123" keyboardType="number-pad" autoComplete="cc-csc" secureTextEntry />
          </View>
        </View>
        <Checkbox checked={isDefault} onChange={setIsDefault}>
          <T s={14}>Use as my default card</T>
        </Checkbox>
      </View>

      <View style={{ marginTop: 'auto', gap: 10 }}>
        <PrimaryButton label="Save card" icon="lock" disabled={digits.length < 12} onPress={() => router.back()} />
        <T s={12} color={c.muted} align="center">Your bank may charge and refund a small amount to check the card.</T>
      </View>
    </SettingsScreen>
  );
}
