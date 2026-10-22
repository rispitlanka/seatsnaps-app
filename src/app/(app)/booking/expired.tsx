import { View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { event } from '@/mocks/catalog';
import { useCart } from '@/providers/cart';
import { CircleButton, PrimaryButton, TextButton } from '@/ui/components';
import { SettingsScreen } from '@/ui/settings';
import { ResultBadge } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** I5 Seat hold expired. */
export default function HoldExpired() {
  const cart = useCart();
  const seats = [...cart.seats].sort();
  const seatText = seats.length ? seats.join(' and ') : 'G5 and G6';
  const toEvent = () => router.dismissTo({ pathname: '/event/[id]', params: { id: event.id } });

  return (
    <SettingsScreen background={c.white} px={24} gap={20} back={<CircleButton icon="close" label="Close" onPress={toEvent} />}>
      <View style={{ marginTop: 20 }}>
        <ResultBadge icon="timer" bg={c.timerBg} color={c.timerInk} />
      </View>
      <View accessibilityRole="alert" style={{ gap: 12 }}>
        <Display accent={c.timerInk}>Time&apos;s <Hl>up.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>We held seats {seatText} for 10 minutes. They&apos;ve been released so others can book. You haven&apos;t been charged.</T>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: c.page, borderRadius: 18 }}>
        <Image source={event.img} style={{ width: 56, height: 56, borderRadius: 12 }} />
        <View style={{ flex: 1, gap: 2 }}>
          <T w={800} s={15}>{event.fullName}</T>
          <T s={12} color={c.muted}>{cart.section} · 16 seats still available</T>
        </View>
      </View>

      <View style={{ marginTop: 'auto', gap: 10 }}>
        <PrimaryButton
          label="Pick seats again"
          onPress={() => {
            cart.setSeats([]);
            cart.startHold();
            router.replace({ pathname: '/event/[id]/seats', params: { id: event.id } });
          }}
        />
        <TextButton label="Back to event" onPress={toEvent} />
      </View>
    </SettingsScreen>
  );
}
