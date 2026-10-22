import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { BOOKING_FEE, PROMO_DISCOUNT, event, lkr, paymentMethods } from '@/mocks/catalog';
import { promoErrors, unknownPromo } from '@/mocks/extras';
import { useCart } from '@/providers/cart';
import { BookingHeader } from '@/ui/booking';
import { Checkbox, Eyebrow, Field, Footer, PrimaryButton, Tap, inputText } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Display, Hl, T } from '@/ui/Text';
import { c, font } from '@/ui/tokens';

function Line({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <T s={14} color={color ?? c.ink2}>{label}</T>
      <T w={700} s={14} color={color}>{value}</T>
    </View>
  );
}

/** D5 Checkout. */
export default function Checkout() {
  const cart = useCart();
  const [agreed, setAgreed] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<[string, string] | null>(null);
  const applyPromo = () => {
    if (cart.promo) {
      cart.setPromo(false);
      setPromoCode('');
      return;
    }
    const code = promoCode.trim().toUpperCase();
    if (!code || code === 'EARLYBIRD') {
      setPromoCode('EARLYBIRD');
      setPromoError(null);
      cart.setPromo(true);
    } else {
      setPromoError(promoErrors[code] ?? unknownPromo);
    }
  };
  const [cardNumber, setCardNumber] = useState('');
  // Sample cards starting with 4000 are declined so the failure screen (I4) can be reviewed.
  const declined = cart.method === 'card' && cardNumber.replace(/\s/g, '').startsWith('4000');
  const seats = [...cart.seats].sort().join(', ');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.page }}>
      <BookingHeader step={3} timer title="Checkout" titleSize={17} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: 22, paddingHorizontal: 20, paddingBottom: 26, gap: 24 }}>
        <Display>Almost <Hl>yours.</Hl></Display>

        <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, overflow: 'hidden' }}>
          <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: c.lineSoft }}>
            <Image source={event.img} style={{ width: 56, height: 56, borderRadius: 14 }} />
            <View style={{ flex: 1, gap: 2 }}>
              <T w={800} s={15}>{event.fullName}</T>
              <T s={12} color={c.muted}>{event.dateLine}</T>
              <T s={12} color={c.muted}>{event.venue}</T>
            </View>
          </View>
          <View style={{ paddingVertical: 14, paddingHorizontal: 16, gap: 10 }}>
            <Line label={`${cart.summary}${seats ? ` · Seats ${seats}` : ''}`} value={lkr(cart.subtotal)} />
            <Line label="Booking fee" value={lkr(BOOKING_FEE)} />
            {cart.promo ? <Line label="Promo · EARLYBIRD" value={`− ${lkr(PROMO_DISCOUNT)}`} color={c.success} /> : null}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
              {/* L4: invalid codes get a red border, an alert icon and a reason below. */}
              <View style={{ flex: 1, height: promoError ? 44 : 46, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: promoError ? c.white : c.field, borderWidth: promoError ? 2 : 1, borderColor: promoError ? c.error : c.line, borderRadius: 12 }}>
                <TextInput
                  accessibilityLabel="Promo code"
                  placeholder="Promo code"
                  placeholderTextColor={c.subtle}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  value={promoCode}
                  onChangeText={v => {
                    setPromoCode(v);
                    setPromoError(null);
                  }}
                  onSubmitEditing={applyPromo}
                  style={[inputText, { flex: 1, fontSize: 14 }, promoError ? { fontFamily: font[800], letterSpacing: 1.1 } : null]}
                />
                {promoError ? <Icon name="alert" size={16} color={c.error} stroke={2.4} /> : null}
              </View>
              <Tap accessibilityRole="button" onPress={applyPromo} style={{ height: 44, paddingHorizontal: 16, borderRadius: 12, backgroundColor: c.ink, justifyContent: 'center' }}>
                <T w={800} s={14} color={c.white}>{cart.promo ? 'Remove' : 'Apply'}</T>
              </Tap>
            </View>
            {promoError ? (
              <View style={{ gap: 6, marginTop: -4 }}>
                <T w={700} s={13} color={c.error} accessibilityRole="alert">{promoError[0]}</T>
                <T s={12} color={c.muted}>{promoError[1]}</T>
              </View>
            ) : null}
          </View>
          <View style={{ paddingVertical: 14, paddingHorizontal: 16, backgroundColor: c.field, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <T w={800} s={15}>Total</T>
            <T w={800} s={22} ls={-0.02}>{lkr(cart.total)}</T>
          </View>
        </View>
        {promoError ? (
          <Tap accessibilityRole="link" onPress={() => router.navigate('/promotions')} style={{ marginTop: -8, alignSelf: 'flex-start' }}>
            <T w={800} s={14} color={c.blue}>See your available codes →</T>
          </Tap>
        ) : null}

        <View style={{ gap: 12 }}>
          <Eyebrow>YOUR DETAILS</Eyebrow>
          <Field label="Full name" placeholder="John Doe" autoComplete="name" textContentType="name" background={c.white} />
          <Field label="Email" placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" background={c.white} hint="We'll send your tickets here." />
          <Field label="Phone" height={52} segment="+94" placeholder="77 123 4567" keyboardType="phone-pad" autoComplete="tel" background={c.white} />
        </View>

        <View style={{ gap: 12 }}>
          <Eyebrow>PAYMENT METHOD</Eyebrow>
          <View accessibilityRole="radiogroup" style={{ gap: 10 }}>
            {paymentMethods.map(m => {
              const on = cart.method === m.id;
              return (
                <Pressable
                  key={m.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  onPress={() => cart.setMethod(m.id)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: c.white, borderRadius: 16, borderWidth: on ? 2 : 1, borderColor: on ? c.blue : c.line }}
                >
                  <View style={{ width: 20, height: 20, borderRadius: 999, borderWidth: on ? 6 : 2, borderColor: on ? c.blue : c.disabled, backgroundColor: c.white }} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <T w={800} s={15}>{m.name}</T>
                    <T s={12} color={c.muted}>{m.note}</T>
                  </View>
                </Pressable>
              );
            })}
          </View>
          {cart.method === 'card' ? (
            <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18, padding: 14, gap: 10 }}>
              <Field label="Card number" placeholder="1234 5678 9012 3456" keyboardType="number-pad" autoComplete="cc-number" height={48} radius={12} value={cardNumber} onChangeText={setCardNumber} />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Field label="Expiry" placeholder="MM / YY" keyboardType="number-pad" autoComplete="cc-exp" height={48} radius={12} />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="CVC" placeholder="123" keyboardType="number-pad" autoComplete="cc-csc" secureTextEntry height={48} radius={12} />
                </View>
              </View>
            </View>
          ) : null}
        </View>

        <Checkbox checked={agreed} onChange={setAgreed}>
          <T s={13} lh={1.5} color={c.ink2}>
            I agree to the <T w={700} s={13} color={c.blue} onPress={() => router.push('/legal')}>Terms</T> and the event&apos;s <T w={700} s={13} color={c.blue} onPress={() => router.push('/legal')}>refund policy</T>.
          </T>
        </Checkbox>
      </ScrollView>

      <Footer gap={10}>
        <PrimaryButton icon="lock" label={`Pay ${lkr(cart.total)}`} disabled={!agreed} onPress={() => router.push({ pathname: '/booking/processing', params: declined ? { fail: '1' } : {} })} />
        <T s={12} color={c.muted} align="center">Secure checkout · tickets delivered instantly</T>
      </Footer>
    </KeyboardAvoidingView>
  );
}
