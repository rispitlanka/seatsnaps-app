import { View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { pushSamples } from '@/mocks/account';
import { img } from '@/ui/assets';
import { PermissionScreen } from '@/ui/permission';
import { Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const toHome = () => router.dismissTo('/');

/** G7 Push notification permission. The OS request is wired with push notifications. */
export default function PushPermission() {
  return (
    <PermissionScreen
      heroStyle={{ gap: 12, paddingHorizontal: 28 }}
      watermark={{ right: -150, bottom: -120 }}
      hero={pushSamples.map(n => (
        <View
          key={n.time}
          style={{ width: '100%', backgroundColor: `rgba(255,255,255,${n.op})`, borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, transform: [{ rotate: n.rot }], boxShadow: '0 12px 24px rgba(6,12,40,0.25)' }}
        >
          <Image source={img.appIcon} style={{ width: 36, height: 36 }} />
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T w={800} s={12}>SeatSnaps</T>
              <T s={11} color={c.muted}>{n.time}</T>
            </View>
            <T s={13} lh={1.35}>{n.text}</T>
          </View>
        </View>
      ))}
      title={<>{'Never miss\n'}<Hl>the night.</Hl></>}
      body="Get reminders before your events, alerts when saved events are selling out, and updates if anything changes."
      primary="Turn on notifications"
      onPrimary={toHome}
      secondary="Not now"
      onSecondary={toHome}
    />
  );
}
