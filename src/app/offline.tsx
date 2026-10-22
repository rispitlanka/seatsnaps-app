import { View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useSession } from '@/providers/session';
import { OutlineButton, PrimaryButton, goBack, useBottomPad, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** K1 No internet. Shown by connectivity checks; reachable at /offline. */
export default function Offline() {
  const { session } = useSession();
  const top = useTopPad();
  const bottom = useBottomPad(34);

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <StatusBar style="light" />
      <View accessibilityRole="alert" style={{ backgroundColor: c.ink, paddingTop: top, paddingHorizontal: 20, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Icon name="wifiOff" size={16} color={c.warnLine} stroke={2.4} />
        <T w={700} s={13} color={c.white}>No connection · showing saved info</T>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingBottom: bottom, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <View style={{ width: 98, height: 98, borderRadius: 999, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="wifiOff" size={42} color={c.blue} />
        </View>
        <Display>You&apos;re <Hl>offline.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2} align="center" style={{ maxWidth: 290 }}>Check your Wi-Fi or mobile data. Your tickets still work — they&apos;re saved on this phone.</T>
        <View style={{ width: '100%', gap: 10, marginTop: 18 }}>
          <PrimaryButton label="Open my tickets" onPress={() => router.replace(session ? '/me/tickets' : '/login')} />
          <OutlineButton label="Try again" s={16} height={56} style={{ backgroundColor: c.white }} onPress={() => goBack('/')} />
        </View>
      </View>
    </View>
  );
}
