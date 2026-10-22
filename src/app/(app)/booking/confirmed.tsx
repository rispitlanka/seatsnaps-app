import { ScrollView, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { BOOKING_FEE, event, lkr } from '@/mocks/catalog';
import { useCart } from '@/providers/cart';
import { img } from '@/ui/assets';
import { CircleButton, Dots, Eyebrow, Perforation, PrimaryButton, QrPattern, Tap, TextButton, useBottomPad, useTopPad } from '@/ui/components';
import { Icon, type IconName } from '@/ui/Icon';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const goHome = () => router.dismissTo('/');

function Action({ icon, label }: { icon: IconName; label: string }) {
  return (
    <Tap accessibilityRole="button" style={{ flex: 1, height: 72, borderRadius: 18, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <Icon name={icon} size={20} color={c.blue} />
      <T w={700} s={12}>{label}</T>
    </Tap>
  );
}

/** D6 Booking confirmed. */
export default function BookingConfirmed() {
  const cart = useCart();
  const top = useTopPad();
  const bottom = useBottomPad();
  const { width } = useWindowDimensions();
  const seats = cart.seats.length ? [...cart.seats].sort() : ['G5', 'G6'];
  const count = seats.length;
  const tier = cart.tier;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar style="light" />
      <LinearGradient colors={[c.heroTop, c.heroBottom]} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 418 + top, overflow: 'hidden' }}>
        <Image source={img.watermark} style={{ position: 'absolute', width: 360, height: 360, right: -130, top: -40, opacity: 0.08 }} />
      </LinearGradient>

      <View style={{ paddingTop: top, paddingHorizontal: 20, gap: 22 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image source={img.wordmarkWhite} style={{ width: 148, height: 28 }} accessibilityLabel="SeatSnaps" />
          <CircleButton icon="close" label="Close" variant="glass" onPress={goHome} />
        </View>

        <View style={{ gap: 12 }}>
          <View style={{ width: 56, height: 56, borderRadius: 999, backgroundColor: c.white, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={28} color={c.blue} stroke={3} />
          </View>
          <Display color={c.white} accent={c.blueSoftLine}>{"You're "}<Hl>in!</Hl></Display>
          <T s={14} lh={1.5} color={c.onDark}>
            Booking confirmed. We&apos;ve emailed your {count} tickets — they&apos;re also saved in the Tickets tab.
          </T>
        </View>

        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginBottom: -48 }}>
          {seats.map((seat, i) => (
            <View key={seat} style={{ width, paddingHorizontal: 20, paddingBottom: 48 }}>
              <View style={{ backgroundColor: c.white, borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 48px rgba(6,12,40,0.25)' }}>
                <View style={{ height: 110 }}>
                  <Image source={event.img} style={{ width: '100%', height: '100%' }} />
                  <View style={{ position: 'absolute', top: 12, right: 12, height: 26, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.white, justifyContent: 'center' }}>
                    <T w={800} s={11}>Ticket {i + 1} of {count}</T>
                  </View>
                </View>
                <View style={{ paddingTop: 16, paddingHorizontal: 18, paddingBottom: 14, gap: 14 }}>
                  <View style={{ gap: 2 }}>
                    <T w={800} s={20} ls={-0.02} upper>{event.fullName}</T>
                    <T s={12} color={c.muted}>{event.venue}, Colombo 07</T>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {[
                      ['Date', '24 Oct', c.ink],
                      ['Doors', '6:45 PM', c.ink],
                      ['Section', `${tier} ${cart.section.split(' ')[1]?.charAt(0) ?? 'C'}`, c.ink],
                      ['Seat', seat, c.blue],
                    ].map(([k, v, color]) => (
                      <View key={k} style={{ flex: 1, gap: 2 }}>
                        <T s={11} color={c.muted}>{k}</T>
                        <T w={800} s={14} color={color}>{v}</T>
                      </View>
                    ))}
                  </View>
                </View>
                <Perforation bg={c.page} />
                <View style={{ paddingTop: 14, paddingHorizontal: 18, paddingBottom: 20, alignItems: 'center', gap: 10 }}>
                  <QrPattern n={17} size={150} seed={5 + i} />
                  <T w={700} s={12} ls={0.12} color={c.muted}>SS-2410-[BOOKING ID]</T>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={{ alignItems: 'center' }}>
          <Dots count={count} active={0} />
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Action icon="wallet" label="Add to wallet" />
          <Action icon="calendar" label="Calendar" />
          <Action icon="send" label={count > 1 ? `Send ticket ${count}` : 'Send ticket'} />
        </View>

        <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, gap: 10 }}>
          <Eyebrow>PAYMENT</Eyebrow>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <T s={14} color={c.ink2}>{count} × {tier} ({seats.join(', ')})</T>
            <T w={700} s={14}>{lkr(cart.subtotal)}</T>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <T s={14} color={c.ink2}>Booking fee</T>
            <T w={700} s={14}>{lkr(BOOKING_FEE)}</T>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: c.lineSoft }}>
            <T w={800} s={14}>Paid · Card •••• [last 4]</T>
            <T w={800} s={14}>{lkr(cart.total)}</T>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 'auto', paddingTop: 20, paddingHorizontal: 20, paddingBottom: bottom, gap: 6 }}>
        <PrimaryButton label="View my tickets" onPress={() => router.push('/booking/ticket')} />
        <TextButton label="Back to home" onPress={goHome} />
      </View>
    </ScrollView>
  );
}
