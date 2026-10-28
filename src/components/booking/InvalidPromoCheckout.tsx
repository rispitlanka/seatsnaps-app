import { ScrollView, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { BOOKING_FEE, lkr } from '@/mocks/catalog';
import { useCart } from '@/providers/cart';
import { HoldTimer } from '@/ui/booking';
import { BackButton, Footer, PrimaryButton, Tap, inputText, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Display, Hl, T } from '@/ui/Text';
import { c, font } from '@/ui/tokens';

/** Board 4, L4: compact invalid-promotion state, separate from the full D5 form. */
export function InvalidPromoCheckout({ code, error, onChange, onApply, onContinue }: {
  code: string; error: [string, string]; onChange: (code: string) => void;
  onApply: () => void; onContinue: () => void;
}) {
  const top = useTopPad();
  const cart = useCart();
  return <View style={{ flex: 1, backgroundColor: c.page }}>
    <View style={{ paddingTop: top, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: c.white,
      borderBottomWidth: 1, borderBottomColor: c.line, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <BackButton /><T w={800} s={17} style={{ flex: 1 }}>Checkout</T><HoldTimer />
    </View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 22, paddingHorizontal: 20, gap: 16 }}>
      <Display>Almost <Hl>yours.</Hl></Display>
      <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, overflow: 'hidden' }}>
        <View style={{ paddingVertical: 14, paddingHorizontal: 16, gap: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T color={c.ink2}>{cart.summary} · Seats {[...cart.seats].sort().join(', ')}</T><T w={700}>{lkr(cart.subtotal)}</T></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T color={c.ink2}>Booking fee</T><T w={700}>{lkr(BOOKING_FEE)}</T></View>
          <View style={{ gap: 6, marginTop: 4 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1, height: 44, paddingHorizontal: 12, borderWidth: 2, borderColor: c.error, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TextInput accessibilityLabel="Promo code" value={code} onChangeText={onChange} onSubmitEditing={onApply} autoCapitalize="characters" autoCorrect={false}
                  style={[inputText, { flex: 1, fontSize: 14, fontFamily: font[800], letterSpacing: 1.12 }]} />
                <Icon name="alert" size={16} color={c.error} stroke={2.4} />
              </View>
              <Tap accessibilityRole="button" onPress={onApply} style={{ height: 44, paddingHorizontal: 16, borderRadius: 12, backgroundColor: c.ink, justifyContent: 'center' }}><T w={800} color={c.white}>Apply</T></Tap>
            </View>
            <T w={700} s={13} color={c.error} accessibilityRole="alert">{error[0]}</T>
            <T s={12} color={c.muted}>{error[1]}</T>
          </View>
        </View>
        <View style={{ paddingVertical: 16, paddingHorizontal: 16, backgroundColor: c.field, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T w={800} s={15}>Total</T><T w={800} s={22} ls={-0.02}>{lkr(cart.total)}</T>
        </View>
      </View>
      <Tap accessibilityRole="link" onPress={() => router.navigate('/promotions')}><T w={800} color={c.blue}>See your available codes →</T></Tap>
    </ScrollView>
    <Footer><PrimaryButton label={`Pay ${lkr(cart.total)}`} onPress={onContinue} /></Footer>
  </View>;
}
