import { Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useSession } from '@/providers/session';
import { OutlineButton, Tap, goBack, useTopPad } from '@/ui/components';
import { ResultBadge } from '@/ui/states';
import { T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** J9 Sign out confirm (over the profile). */
export default function SignOutConfirm() {
  const { signOut } = useSession();
  // The board places the dialog 260pt from the top of an 844pt screen.
  const top = useTopPad(216);

  return (
    <View style={{ flex: 1, paddingTop: top, paddingHorizontal: 24 }}>
      <StatusBar style="light" />
      <Pressable accessibilityLabel="Dismiss" onPress={() => goBack()} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,17,48,0.55)' }} />
      <View accessibilityRole="alert" accessibilityViewIsModal style={{ backgroundColor: c.white, borderRadius: 26, padding: 24, alignItems: 'center', gap: 12, boxShadow: '0 24px 48px rgba(6,12,40,0.3)' }}>
        <ResultBadge icon="logout" bg={c.errorSoft} color={c.error} size={60} iconSize={26} stroke={2.2} />
        <T w={800} s={22} lh={1.1} ls={-0.02} align="center" accessibilityRole="header">Sign out of SeatSnaps?</T>
        <T s={14} lh={1.5} color={c.ink2} align="center">You&apos;ll need to sign in again to buy tickets. Tickets you&apos;ve opened stay available offline on this phone.</T>
        <View style={{ width: '100%', gap: 8, marginTop: 6 }}>
          <Tap accessibilityRole="button" onPress={() => void signOut()} style={{ height: 52, borderRadius: 999, backgroundColor: c.error, alignItems: 'center', justifyContent: 'center' }}>
            <T w={800} s={15} color={c.white}>Sign out</T>
          </Tap>
          <OutlineButton label="Cancel" height={54} onPress={() => goBack()} />
        </View>
      </View>
    </View>
  );
}
