import { Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useSession } from '@/providers/session';
import { Avatar, OutlineButton, Tap, goBack, useBottomPad } from '@/ui/components';
import { Icon, type IconName } from '@/ui/Icon';
import { T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function Option({ icon, label, danger, last }: { icon: IconName; label: string; danger?: boolean; last?: boolean }) {
  return (
    <Tap accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: last ? 0 : 1, borderBottomColor: c.line }}>
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: c.white, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={20} color={danger ? c.error : c.blue} />
      </View>
      <T w={700} s={15} color={danger ? c.error : c.ink}>{label}</T>
    </Tap>
  );
}

/** L11 Profile photo picker. Camera and gallery access aren't wired yet. */
export default function PhotoPicker() {
  const { user } = useSession();
  const bottom = useBottomPad();
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Ramesh Ram';
  const initials = name.split(/\s+/).map(p => p.charAt(0)).join('').slice(0, 2).toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(10,17,48,0.72)' }}>
      <StatusBar style="light" />
      <Pressable accessibilityLabel="Dismiss" onPress={() => goBack()} style={{ flex: 1 }} />
      <View accessibilityViewIsModal accessibilityLabel="Profile photo" style={{ backgroundColor: c.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 10, paddingHorizontal: 20, paddingBottom: bottom, gap: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 40, height: 5, borderRadius: 999, backgroundColor: c.dot }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Avatar initials={initials} size={64} bg={c.blue} textSize={20} />
          <View style={{ gap: 2 }}>
            <T w={800} s={18}>Profile photo</T>
            <T s={13} color={c.muted}>Shown to organisers on your bookings</T>
          </View>
        </View>
        <View style={{ backgroundColor: c.page, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 14 }}>
          <Option icon="camera" label="Take a photo" />
          <Option icon="gallery" label="Choose from gallery" />
          <Option icon="trash" label="Remove photo" danger last />
        </View>
        <OutlineButton label="Cancel" s={16} height={56} onPress={() => goBack()} />
      </View>
    </View>
  );
}
