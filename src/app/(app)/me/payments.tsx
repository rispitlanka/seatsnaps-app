import { View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { useSession } from '@/providers/session';
import { img } from '@/ui/assets';
import { Tap } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { ListCard, ListRow, RowAction, SettingsScreen } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** E5 Payment methods. */
export default function PaymentMethods() {
  const { user } = useSession();
  const holder = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Ramesh Ram';

  return (
    <SettingsScreen>
      <Display>Payment <Hl>methods.</Hl></Display>

      <LinearGradient colors={[c.heroTop, c.ink]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: 196, borderRadius: 24, padding: 20, justifyContent: 'space-between', overflow: 'hidden' }}>
        <Image source={img.watermark} style={{ position: 'absolute', width: 200, height: 200, right: -50, bottom: -60, opacity: 0.1 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ width: 40, height: 30, borderRadius: 6, backgroundColor: c.blueSoftLine }} />
          <View style={{ height: 26, paddingHorizontal: 10, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)', justifyContent: 'center' }}>
            <T w={800} s={11} color={c.white}>DEFAULT</T>
          </View>
        </View>
        <T w={800} s={20} ls={0.14} color={c.white}>•••• •••• •••• [last 4]</T>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ gap: 2 }}>
            <T s={12} color={c.onDark}>Card holder</T>
            <T w={800} s={14} color={c.white}>{holder}</T>
          </View>
          <View style={{ gap: 2, alignItems: 'flex-end' }}>
            <T s={12} color={c.onDark}>Expires</T>
            <T w={800} s={14} color={c.white}>MM/YY</T>
          </View>
        </View>
      </LinearGradient>

      <ListCard>
        <ListRow title="Visa •••• [last 4]" sub="Default for checkout" icon="card" gap={1} trailing={<RowAction label="Remove" color={c.error} />} />
        <ListRow title="Mobile wallet" sub="Not linked" icon="phone" tint="grey" gap={1} last trailing={<RowAction label="Link" color={c.blue} w={800} />} />
      </ListCard>

      <Tap accessibilityRole="button" onPress={() => router.push('/me/add-card')} style={{ height: 56, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: c.seatLine, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Icon name="plus" size={18} color={c.blueDeep} stroke={2.6} />
        <T w={800} s={15} color={c.blueDeep}>Add a new card</T>
      </Tap>

      <View style={{ marginTop: 'auto', flexDirection: 'row', gap: 8 }}>
        <View style={{ marginTop: 1 }}>
          <Icon name="lock" size={16} color={c.muted} />
        </View>
        <T s={12} lh={1.5} color={c.muted} style={{ flex: 1 }}>Card details are stored by our payment provider. SeatSnaps never sees your full card number.</T>
      </View>
    </SettingsScreen>
  );
}
