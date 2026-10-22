import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import { img } from '@/ui/assets';
import { GoogleButton, OrDivider, PrimaryButton, Tap, goBack, useBottomPad } from '@/ui/components';
import { BottomSheet } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/**
 * I9 Sign in to book. Shown when a signed-out guest tries to book; the app
 * currently requires sign-in before browsing, so this is reachable at /sign-in-to-book.
 */
export default function SignInToBook() {
  const bottom = useBottomPad();
  return (
    <BottomSheet
      offset={290}
      label="Sign in to book"
      backdrop={c.ink}
      onClose={() => goBack('/login')}
      under={<Image source={img.festival} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 420, opacity: 0.45 }} />}
    >
      <View style={{ flex: 1, paddingHorizontal: 24, paddingBottom: bottom, gap: 14 }}>
        <Image source={img.appIcon} style={{ width: 48, height: 48, marginTop: 20 }} />
        <View style={{ gap: 8 }}>
          <Display size={28}>Sign in to <Hl>book.</Hl></Display>
          <T s={14} lh={1.5} color={c.ink2}>Your seats and tickets stay safe in your account. We&apos;ll bring you right back to Tamil Fest 2026.</T>
        </View>
        <View style={{ marginTop: 4 }}>
          <GoogleButton />
        </View>
        <PrimaryButton label="Sign in with email" height={52} onPress={() => router.push('/login')} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <T s={14} color={c.ink2}>New here? </T>
          <Tap accessibilityRole="link" onPress={() => router.push('/signup')}>
            <T w={700} s={14} color={c.blue}>Create an account</T>
          </Tap>
        </View>
        <OrDivider />
        <Tap accessibilityRole="button" onPress={() => router.push('/signup')} style={{ height: 52, borderRadius: 999, backgroundColor: c.page, alignItems: 'center', justifyContent: 'center' }}>
          <T w={700} s={15}>Continue as guest</T>
        </Tap>
        <T s={12} color={c.muted} align="center">Guests only need an email. Tickets are emailed to you.</T>
      </View>
    </BottomSheet>
  );
}
