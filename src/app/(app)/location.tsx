import { View } from 'react-native';
import { router } from 'expo-router';

import { Icon } from '@/ui/Icon';
import { PermissionScreen } from '@/ui/permission';
import { Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** G5 Location permission. The OS permission request is wired with the location feature. */
export default function LocationPermission() {
  return (
    <PermissionScreen
      watermark={{ left: -150, bottom: -120 }}
      hero={
        <>
          <View style={{ position: 'absolute', width: 300, height: 300, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' }} />
          <View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)' }} />
          <View style={{ position: 'absolute', width: 110, height: 110, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)' }} />
          <View style={{ width: 72, height: 72, borderRadius: 999, backgroundColor: c.white, alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 32px rgba(6,12,40,0.35)' }}>
            <Icon name="pin" size={34} color={c.blue} stroke={2.2} />
          </View>
          <View style={{ position: 'absolute', top: 120, right: 52, height: 30, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.white, justifyContent: 'center' }}>
            <T w={800} s={12}>2.4 km away</T>
          </View>
          <View style={{ position: 'absolute', bottom: 110, left: 44, height: 30, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.ink, justifyContent: 'center' }}>
            <T w={800} s={12} color={c.white}>Tonight near you</T>
          </View>
        </>
      }
      title={<>{"See what's on\n"}<Hl>near you.</Hl></>}
      body="Share your location to see events, distances and directions. We only use it while the app is open."
      primary="Allow location"
      onPrimary={() => router.replace('/push')}
      secondary="Choose a city instead"
      onSecondary={() => router.push('/city')}
    />
  );
}
