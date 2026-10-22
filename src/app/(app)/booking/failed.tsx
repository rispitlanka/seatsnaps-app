import { View } from 'react-native';
import { router } from 'expo-router';

import { useCountdown } from '@/hooks/useCountdown';
import { useCart } from '@/providers/cart';
import { CircleButton, Eyebrow, OutlineButton, PrimaryButton, TextButton, goBack } from '@/ui/components';
import { SettingsScreen } from '@/ui/settings';
import { Callout, ResultBadge } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const fixes = ['Check the card number, expiry and CVC', 'Make sure online payments are enabled on the card', 'Try a different card or payment method'];

/** I4 Payment failed. */
export default function PaymentFailed() {
  const cart = useCart();
  const ms = useCountdown(cart.holdUntil);
  const secs = Math.ceil(ms / 1000);
  const left = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  const seats = [...cart.seats].sort().join(', ') || 'G5, G6';

  return (
    <SettingsScreen background={c.white} px={24} gap={20} back={<CircleButton icon="close" label="Back to checkout" onPress={() => goBack()} />}>
      <View style={{ marginTop: 20 }}>
        <ResultBadge icon="cardX" bg={c.errorSoft} color={c.error} stroke={2.6} />
      </View>
      <View accessibilityRole="alert" style={{ gap: 12 }}>
        <Display accent={c.error}>{"Payment didn't\n"}<Hl>go through.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>Your bank declined the card ending [last 4]. You haven&apos;t been charged.</T>
      </View>

      <Callout icon="timer" tone="warn">
        <T s={14} color={c.timerInk}><T w={700} s={14} color={c.timerInk}>Seats {seats} still held for {cart.holdUntil ? left : '06:12'}.</T> Try again before the timer runs out.</T>
      </Callout>

      <View style={{ backgroundColor: c.page, borderRadius: 16, padding: 14, gap: 8 }}>
        <Eyebrow>COMMON FIXES</Eyebrow>
        {fixes.map(f => (
          <T key={f} s={13} lh={1.5} color={c.ink2}>• {f}</T>
        ))}
      </View>

      <View style={{ marginTop: 'auto', gap: 10 }}>
        <PrimaryButton label="Try again" onPress={() => router.replace('/booking/processing')} />
        <OutlineButton label="Use another method" s={16} height={56} onPress={() => goBack()} />
        <TextButton label="Contact support" color={c.blue} s={14} height={40} onPress={() => router.push('/contact')} />
      </View>
    </SettingsScreen>
  );
}
