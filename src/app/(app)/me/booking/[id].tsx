import { View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { event } from '@/mocks/catalog';
import { useSession } from '@/providers/session';
import { Eyebrow, Tap, TextButton } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { ListCard, SettingsScreen } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function SeatTile({ seat, mine }: { seat: string; mine?: boolean }) {
  return (
    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: mine ? c.blue : c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
      <T w={800} s={14} color={mine ? c.white : c.blueDeep}>{seat}</T>
    </View>
  );
}

function Pill({ label, onPress, dark }: { label: string; onPress: () => void; dark?: boolean }) {
  return (
    <Tap accessibilityRole="button" onPress={onPress} style={{ height: dark ? 36 : 38, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center', backgroundColor: dark ? c.ink : c.white, borderWidth: dark ? 0 : 1, borderColor: c.line }}>
      <T w={dark ? 800 : 700} s={13} color={dark ? c.white : c.ink}>{label}</T>
    </Tap>
  );
}

function Line({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <T w={bold ? 800 : 400} s={14} color={bold ? c.ink : c.ink2}>{label}</T>
      <T w={bold ? 800 : 700} s={14}>{value}</T>
    </View>
  );
}

/** J1 Booking detail. */
export default function BookingDetail() {
  const { user } = useSession();
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Ramesh Ram';

  return (
    <SettingsScreen>
      <View style={{ gap: 8 }}>
        <View style={{ alignSelf: 'flex-start', height: 28, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.successSoft, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="check" size={13} color={c.success} stroke={3} />
          <T w={800} s={12} color={c.success}>Confirmed</T>
        </View>
        <Display>Your <Hl>booking.</Hl></Display>
        <T s={13} color={c.muted}>Order SS-2410-[BOOKING ID] · booked 14 Oct, 3:12 PM</T>
      </View>

      <Tap accessibilityRole="button" accessibilityLabel={event.fullName} onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })} style={{ flexDirection: 'row', gap: 12, padding: 8, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20 }}>
        <Image source={event.img} style={{ width: 84, height: 84, borderRadius: 14 }} />
        <View style={{ flex: 1, gap: 3, paddingVertical: 4 }}>
          <T w={800} s={16}>{event.fullName}</T>
          <T s={12} color={c.muted}>Sat 24 Oct · 7:30 PM (doors 6:45)</T>
          <T s={12} color={c.muted}>{event.venue}</T>
        </View>
      </Tap>

      <View style={{ gap: 10 }}>
        <Eyebrow>TICKETS · 2</Eyebrow>
        <ListCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.lineSoft }}>
            <SeatTile seat="G5" mine />
            <View style={{ flex: 1, gap: 2 }}>
              <T w={800} s={15}>Gold · {name}</T>
              <T s={12} color={c.muted}>Yours</T>
            </View>
            <Pill dark label="Show QR" onPress={() => router.push('/me/booking/gate')} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
            <SeatTile seat="G6" />
            <View style={{ flex: 1, gap: 2 }}>
              <T w={800} s={15}>Gold · Guest</T>
              <T s={12} color={c.muted}>Not sent yet</T>
            </View>
            <Pill label="Send" onPress={() => router.push('/me/booking/send')} />
          </View>
        </ListCard>
      </View>

      <View style={{ gap: 10 }}>
        <Eyebrow>PAYMENT</Eyebrow>
        <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, gap: 10 }}>
          <Line label="2 × Gold" value="LKR 10,000" />
          <Line label="Booking fee" value="LKR 300" />
          <View style={{ paddingTop: 10, borderTopWidth: 1, borderTopColor: c.lineSoft }}>
            <Line label="Paid · Card •••• [last 4]" value="LKR 10,300" bold />
          </View>
          <Tap accessibilityRole="link" style={{ alignSelf: 'flex-start', minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="download" size={16} color={c.blue} stroke={2.2} />
            <T w={800} s={14} color={c.blue}>Download invoice (PDF)</T>
          </Tap>
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Eyebrow>REFUND STATUS</Eyebrow>
        <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, gap: 6 }}>
          <T w={800} s={15}>No refund requested</T>
          <T s={13} lh={1.5} color={c.ink2}>Refundable until Thu 22 Oct, 7:30 PM (48 hours before the event).</T>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {['Add to calendar', 'Directions'].map(label => (
          <Tap key={label} accessibilityRole="button" onPress={label === 'Directions' ? () => router.push({ pathname: '/explore/venue/[id]', params: { id: 'nelum-pokuna-theatre' } }) : undefined} style={{ flex: 1, height: 50, borderRadius: 999, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
            <T w={700} s={14}>{label}</T>
          </Tap>
        ))}
      </View>
      <View style={{ gap: 4 }}>
        <TextButton label="Cancel booking & request refund" w={800} color={c.error} onPress={() => router.push('/me/booking/refund')} />
        <TextButton label="Get help with this booking" color={c.blue} s={14} height={40} onPress={() => router.push('/contact')} />
      </View>
    </SettingsScreen>
  );
}
