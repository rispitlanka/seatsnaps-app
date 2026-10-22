import { View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useSession } from '@/providers/session';
import { img } from '@/ui/assets';
import { Tap, TextButton, useBottomPad, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** K2 Force update. Shown when the installed version is below the supported minimum; reachable at /update. */
export default function ForceUpdate() {
  const { session } = useSession();
  const top = useTopPad(16);
  const bottom = useBottomPad(40);

  return (
    <LinearGradient colors={[c.heroTop, c.heroBottom, c.night]} locations={[0, 0.55, 1]} style={{ flex: 1, paddingTop: top, paddingHorizontal: 28, paddingBottom: bottom, gap: 16, overflow: 'hidden' }}>
      <StatusBar style="light" />
      <Image source={img.watermark} style={{ position: 'absolute', width: 420, height: 420, right: -170, top: 140, opacity: 0.08 }} />
      <Image source={img.wordmarkWhite} style={{ width: 158, height: 30 }} accessibilityLabel="SeatSnaps" />
      <View style={{ marginTop: 'auto', gap: 14 }}>
        <View style={{ alignSelf: 'flex-start', height: 30, paddingHorizontal: 12, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="download" size={14} color={c.white} stroke={2.4} />
          <T w={800} s={12} color={c.white}>Version [x.y] available</T>
        </View>
        <Display size={40} color={c.white} accent={c.blueSoftLine}>{'Time for an\n'}<Hl>update.</Hl></Display>
        <T s={15} lh={1.5} color={c.onDark}>This version of SeatSnaps is no longer supported. Update to keep booking — it only takes a minute.</T>
      </View>
      <View style={{ marginTop: 26, gap: 10 }}>
        <Tap accessibilityRole="button" style={{ height: 54, borderRadius: 999, backgroundColor: c.white, alignItems: 'center', justifyContent: 'center' }}>
          <T w={800} s={16}>Update now</T>
        </Tap>
        <TextButton label="Show my saved tickets" color={c.white} s={14} onPress={() => router.replace(session ? '/me/tickets' : '/login')} />
      </View>
      <T s={12} color={c.onDarkMuted} align="center">You have [x.y.z] · minimum supported [x.y]</T>
    </LinearGradient>
  );
}
