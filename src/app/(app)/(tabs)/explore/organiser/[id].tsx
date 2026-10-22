import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { organiserEvents } from '@/mocks/catalog';
import { img } from '@/ui/assets';
import { Avatar, BackButton, CircleButton, Tap, UnderlineTabs, useTopPad } from '@/ui/components';
import { Icon, VerifiedIcon } from '@/ui/Icon';
import { Display, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** C5 Organiser profile. */
export default function OrganiserProfile() {
  const top = useTopPad();
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState('Upcoming (8)');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ paddingBottom: 28 }}>
      <StatusBar style="light" />
      <View style={{ height: 148 + top, backgroundColor: c.ink }}>
        <Image source={img.concert} style={{ width: '100%', height: '100%' }} />
        <View style={{ position: 'absolute', top, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <BackButton variant="solid" />
          <CircleButton icon="share" label="Share" variant="solid" iconSize={19} stroke={2} />
        </View>
      </View>

      <View style={{ marginTop: -28, backgroundColor: c.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}>
        <View style={{ marginTop: -44 }}>
          <Avatar initials="PL" size={88} bg={c.blue} textSize={28} border={{ width: 5, color: c.white }} />
        </View>

        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Display size={28}>Pulse Live LK</Display>
            <VerifiedIcon size={22} />
          </View>
          <T s={13} color={c.muted}>Concert promoter · Colombo</T>
          <T s={14} lh={1.5} color={c.ink2} style={{ marginTop: 6 }}>[Short organiser bio — who they are, the kind of nights they run, and where.]</T>
        </View>

        <View style={{ flexDirection: 'row', backgroundColor: c.page, borderRadius: 18, paddingVertical: 14 }}>
          {[
            ['8', 'Upcoming'],
            ['[n]', 'Events hosted'],
            ['[n]', 'Followers'],
          ].map(([value, label], i) => (
            <View key={label} style={{ flex: 1, alignItems: 'center', gap: 2, borderLeftWidth: i === 1 ? 1 : 0, borderRightWidth: i === 1 ? 1 : 0, borderColor: c.line }}>
              <T w={800} s={18}>{value}</T>
              <T s={12} color={c.muted}>{label}</T>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Tap accessibilityRole="button" accessibilityState={{ selected: following }} onPress={() => setFollowing(f => !f)} style={{ flex: 1, height: 50, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: following ? c.white : c.blue, borderWidth: following ? 1 : 0, borderColor: c.line }}>
            <T w={800} s={15} color={following ? c.ink : c.white}>{following ? 'Following' : 'Follow'}</T>
          </Tap>
          <Tap accessibilityRole="button" style={{ flex: 1, height: 50, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
            <T w={700} s={15}>Message</T>
          </Tap>
          <Tap accessibilityRole="button" accessibilityLabel="Notify me about new events" style={{ width: 50, height: 50, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bell" size={20} />
          </Tap>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 14 }}>
        <View style={{ paddingTop: 6, borderBottomWidth: 1, borderBottomColor: c.line }}>
          <UnderlineTabs options={['Upcoming (8)', 'Past', 'About']} value={tab} onChange={setTab} />
        </View>
        {organiserEvents.map(e => (
          <Tap key={e.id} accessibilityRole="button" accessibilityLabel={e.name} onPress={() => router.push({ pathname: '/event/[id]', params: { id: e.id } })} style={{ flexDirection: 'row', gap: 12, padding: 8, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20 }}>
            <Image source={e.img} style={{ width: 92, height: 92, borderRadius: 14 }} />
            <View style={{ flex: 1, minWidth: 0, paddingVertical: 4, paddingRight: 6, gap: 4 }}>
              <T w={800} s={12} color={c.blue}>{e.date}</T>
              <T w={800} s={15} ls={-0.01}>{e.name}</T>
              <T s={12} color={c.muted}>{e.venue}</T>
              <T w={800} s={14} style={{ marginTop: 'auto' }}>{e.price}</T>
            </View>
          </Tap>
        ))}
      </View>
    </ScrollView>
  );
}
