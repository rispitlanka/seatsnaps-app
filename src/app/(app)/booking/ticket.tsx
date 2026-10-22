import { View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { event } from '@/mocks/catalog';
import { useCart } from '@/providers/cart';
import { CircleButton, Perforation, QrPattern, Tap, useBottomPad, useTopPad } from '@/ui/components';
import { Icon, type IconName } from '@/ui/Icon';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function Button({ icon, label, bg }: { icon: IconName; label: string; bg: string }) {
  return (
    <Tap accessibilityRole="button" style={{ flex: 1, height: 54, borderRadius: 999, backgroundColor: bg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <Icon name={icon} size={18} color={c.white} />
      <T w={700} s={15} color={c.white}>{label}</T>
    </Tap>
  );
}

/** D7 E-ticket. */
export default function ETicket() {
  const cart = useCart();
  const top = useTopPad();
  const bottom = useBottomPad();
  const seats = cart.seats.length ? [...cart.seats].sort().join(', ') : 'G5, G6';

  return (
    <View style={{ flex: 1, backgroundColor: c.ink, paddingTop: top, paddingHorizontal: 20, paddingBottom: bottom, gap: 22 }}>
      <StatusBar style="light" />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <CircleButton icon="close" label="Close" variant="navy" onPress={() => router.dismissTo('/')} />
        <View style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.successBg, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="check" size={14} color={c.successInk} stroke={2.6} />
          <T w={700} s={12} color={c.successInk}>Booking confirmed</T>
        </View>
      </View>

      <Display color={c.white} accent={c.blueBright}>{"You're "}<Hl>in.</Hl></Display>

      <View style={{ backgroundColor: c.white, borderRadius: 24, overflow: 'hidden' }}>
        <View style={{ padding: 20, gap: 16 }}>
          <View style={{ gap: 4 }}>
            <T w={600} s={12} ls={0.06} upper color={c.muted}>{event.category}</T>
            <T w={800} s={22} ls={-0.02}>{event.fullName}</T>
            <T s={13} color={c.muted}>{event.venue}, Colombo 07</T>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[
              ['Date', 'Sat 24 Oct', c.ink],
              ['Doors', '7:00 PM', c.ink],
              ['Seats', seats, c.blue],
            ].map(([k, v, color]) => (
              <View key={k} style={{ flex: 1, gap: 2 }}>
                <T s={11} color={c.muted}>{k}</T>
                <T w={800} s={15} color={color}>{v}</T>
              </View>
            ))}
          </View>
        </View>
        <Perforation notch={24} inset={20} bg={c.ink} />
        <View style={{ paddingTop: 18, paddingHorizontal: 20, paddingBottom: 22, alignItems: 'center', gap: 12 }}>
          <QrPattern n={17} size={170} seed={7} threshold={0.52} />
          <T w={600} s={12} ls={0.12} color={c.muted}>SS-2410-[BOOKING ID]</T>
        </View>
      </View>

      <T s={13} color={c.onDarkMuted} align="center">Show this code at the gate. Brightness up helps.</T>

      <View style={{ marginTop: 'auto', flexDirection: 'row', gap: 10 }}>
        <Button icon="wallet" label="Add to wallet" bg={c.blue} />
        <Button icon="pin" label="Directions" bg={c.navy} />
      </View>
    </View>
  );
}
