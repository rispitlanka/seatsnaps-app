import { View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useSession } from '@/providers/session';
import { img } from '@/ui/assets';
import { PrimaryButton, TextButton, useBottomPad, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Callout } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** K3 Maintenance. Shown while booking is paused; reachable at /maintenance. */
export default function Maintenance() {
  const { session } = useSession();
  const top = useTopPad(16);
  const bottom = useBottomPad(40);

  return (
    <View style={{ flex: 1, backgroundColor: c.white, paddingTop: top, paddingHorizontal: 24, paddingBottom: bottom, gap: 18 }}>
      <StatusBar style="dark" />
      <Image source={img.wordmarkDark} style={{ width: 158, height: 30 }} accessibilityLabel="SeatSnaps" />
      <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
        <View style={{ width: 88, height: 88, borderRadius: 28, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="wrench" size={40} color={c.blue} />
        </View>
        <Display>Back <Hl>soon.</Hl></Display>
        <T s={15} lh={1.5} color={c.ink2}>We&apos;re making SeatSnaps better. Booking is paused until about <T w={700} s={15}>[time], [date]</T>.</T>
        <Callout icon="check" tone="success">
          <T s={14} lh={1.5} color={c.successDeep}>Your tickets still work. Gates scan as normal during maintenance.</T>
        </Callout>
      </View>
      <View style={{ gap: 10 }}>
        <PrimaryButton label="Show my tickets" onPress={() => router.replace(session ? '/me/tickets' : '/login')} />
        <TextButton label="Check service status" color={c.blue} s={14} />
      </View>
    </View>
  );
}
