import { ScrollView, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { profileMenu, profileStats, settingsMenu, type MenuItem } from '@/mocks/account';
import { useSession } from '@/providers/session';
import { Avatar, Tap, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Chevron, ListRow } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function Menu({ items, tint }: { items: MenuItem[]; tint: 'blue' | 'grey' }) {
  return (
    <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, paddingVertical: 4, paddingHorizontal: 6 }}>
      {items.map((m, i) => (
        <ListRow
          key={m.label}
          title={m.label}
          sub={m.sub}
          icon={m.icon}
          tint={tint}
          px={10}
          gap={1}
          last={i === items.length - 1}
          trailing={<Chevron />}
          onPress={m.href ? () => router.push(m.href as Href) : undefined}
        />
      ))}
    </View>
  );
}

/** E2 Profile. */
export default function Profile() {
  const { user } = useSession();
  const top = useTopPad();
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Ramesh Ram';
  const initials = name.split(/\s+/).map(p => p.charAt(0)).join('').slice(0, 2).toUpperCase();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ paddingTop: top, paddingHorizontal: 20, paddingBottom: 28, gap: 18 }}>
      <StatusBar style="dark" />
      <Display>My <Hl>profile.</Hl></Display>

      <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 24, padding: 18, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View>
            <Avatar initials={initials} size={68} bg={c.blue} textSize={22} />
            <View style={{ position: 'absolute', right: -2, bottom: -2, width: 32, height: 32, borderRadius: 999, backgroundColor: c.ink, borderWidth: 3, borderColor: c.white, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="pencil" size={12} color={c.white} stroke={2.6} />
            </View>
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
            <T w={800} s={18} ls={-0.01} numberOfLines={1}>{name}</T>
            <T s={13} color={c.muted} numberOfLines={1}>{user?.email ?? 'ramesh@example.com'}</T>
          </View>
          <Tap accessibilityRole="button" onPress={() => router.push('/me/account')} style={{ height: 38, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: c.line, justifyContent: 'center' }}>
            <T w={700} s={13}>Edit</T>
          </Tap>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: c.page, borderRadius: 18, paddingVertical: 14 }}>
          {profileStats.map(([label, value, sub], i) => (
            <View key={label} style={{ flex: 1, alignItems: 'center', gap: 2, borderLeftWidth: i === 1 ? 1 : 0, borderRightWidth: i === 1 ? 1 : 0, borderColor: c.line }}>
              <T w={800} s={10} ls={0.12} color={c.muted}>{label}</T>
              <T w={800} s={15}>{value}</T>
              <T s={11} color={c.muted}>{sub}</T>
            </View>
          ))}
        </View>
      </View>

      <Menu items={profileMenu} tint="blue" />
      <Menu items={settingsMenu} tint="grey" />

      <Tap accessibilityRole="button" onPress={() => router.push('/sign-out')} style={{ height: 56, borderRadius: 18, backgroundColor: c.white, borderWidth: 1, borderColor: c.errorLine, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <Icon name="logout" size={18} color={c.error} stroke={2.2} />
        <T w={800} s={15} color={c.error}>Sign out</T>
      </Tap>
      <T s={12} color={c.muted} align="center">SeatSnaps · version [x.y.z]</T>
    </ScrollView>
  );
}
