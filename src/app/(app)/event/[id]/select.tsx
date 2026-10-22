import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { MAX_TICKETS, event, lkr, tiers } from '@/mocks/catalog';
import { useCart } from '@/providers/cart';
import { BookingHeader } from '@/ui/booking';
import { Footer, PrimaryButton, Tap } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** D2 Select tickets. */
export default function SelectTickets() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cart = useCart();

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <BookingHeader step={1} thumb={event.img} title={event.fullName} subtitle={`${event.dateLine} · ${event.shortVenue}`} />
      <ScrollView contentContainerStyle={{ paddingVertical: 22, paddingHorizontal: 20, gap: 14 }}>
        <Display style={{ marginBottom: 4 }}>Select <Hl>tickets.</Hl></Display>

        {tiers.map(t => {
          const qty = cart.qty[t.name] ?? 0;
          return (
            <View key={t.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: c.white, borderRadius: 18, borderWidth: qty ? 2 : 1, borderColor: qty ? c.blue : c.line }}>
              <View style={{ width: 12, height: 40, borderRadius: 6, backgroundColor: t.dot }} />
              <View style={{ flex: 1, gap: 3 }}>
                <T w={800} s={15}>{t.name} · {lkr(t.price)}</T>
                <T s={12} color={c.muted}>{t.perk}</T>
                <T w={700} s={12} color={t.fast ? c.urgent : c.muted}>{t.avail}</T>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Tap
                  accessibilityRole="button"
                  accessibilityLabel={`Remove one ${t.name} ticket`}
                  disabled={!qty}
                  onPress={() => cart.setQty(t.name, qty - 1)}
                  style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="minus" size={16} color={qty ? c.ink : c.disabled} stroke={2.6} />
                </Tap>
                <T w={800} s={16} align="center" style={{ width: 26 }} accessibilityLiveRegion="polite">{qty}</T>
                <Tap
                  accessibilityRole="button"
                  accessibilityLabel={`Add one ${t.name} ticket`}
                  onPress={() => cart.count < MAX_TICKETS && cart.setQty(t.name, qty + 1)}
                  style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="plus" size={16} color={c.white} stroke={2.6} />
                </Tap>
              </View>
            </View>
          );
        })}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: c.blueSoft, borderRadius: 14 }}>
          <Icon name="info" size={18} color={c.blueDeep} />
          <T s={13} color={c.blueDeep} style={{ flex: 1 }}>Up to 6 tickets per order. You&apos;ll pick exact seats next.</T>
        </View>
      </ScrollView>

      <Footer>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <T s={14} color={c.ink2}>{cart.count ? cart.summary : 'No tickets yet'}</T>
          <T w={800} s={20} ls={-0.02}>{lkr(cart.subtotal)}</T>
        </View>
        <PrimaryButton label="Continue to seats" disabled={!cart.count} onPress={() => router.push({ pathname: '/event/[id]/section', params: { id } })} />
      </Footer>
    </View>
  );
}
