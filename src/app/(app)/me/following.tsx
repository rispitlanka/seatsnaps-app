import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { followedOrganisers, followedVenues, type Followed } from '@/mocks/extras';
import { Avatar, Segmented, Tap } from '@/ui/components';
import { SettingsScreen } from '@/ui/settings';
import { EmptyState } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** Overlapping avatars (L9 artwork). */
function FollowArt() {
  const faces = [
    { label: 'TA', bg: c.ink, fg: c.white },
    { label: 'PL', bg: c.blue, fg: c.white },
    { label: '+', bg: c.blueSoft, fg: c.blueDeep },
  ];
  return (
    <View style={{ flexDirection: 'row' }}>
      {faces.map((f, i) => (
        <View key={f.label} style={{ marginLeft: i ? -18 : 0 }}>
          <Avatar initials={f.label} size={72} bg={f.bg} fg={f.fg} textSize={16} border={{ width: 4, color: c.page }} />
        </View>
      ))}
    </View>
  );
}

/** L10 Following; L9 once nothing is followed. Following isn't synced to the API yet. */
export default function Following() {
  const [tab, setTab] = useState<'org' | 'ven'>('org');
  const [unfollowed, setUnfollowed] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setUnfollowed(u => ({ ...u, [id]: !u[id] }));
  const followingCount = (list: Followed[], prefix: string) => list.filter(x => !unfollowed[prefix + x.id]).length;
  const orgCount = followingCount(followedOrganisers, 'o:');
  const venCount = followingCount(followedVenues, 'v:');
  useEffect(() => { if (!orgCount && !venCount) setTab('org'); }, [orgCount, venCount]);
  const tabs = [`Organisers (${orgCount})`, `Venues (${venCount})`];
  const rows = tab === 'org' ? followedOrganisers : followedVenues;
  const prefix = tab === 'org' ? 'o:' : 'v:';

  if (!orgCount && !venCount) {
    return (
      <SettingsScreen>
        <Display>Follow<Hl>ing.</Hl></Display>
        <Segmented options={tabs} value={tabs[tab === 'org' ? 0 : 1]} onChange={v => setTab(v === tabs[0] ? 'org' : 'ven')} />
        <EmptyState
          art={<FollowArt />}
          title="Not following anyone yet"
          body="Follow organisers and venues to hear about new events first."
          action="Browse organisers"
          onAction={() => router.navigate({ pathname: '/explore', params: { tab: 'Organisers' } })}
        />
      </SettingsScreen>
    );
  }

  return (
    <SettingsScreen>
      <Display>Follow<Hl>ing.</Hl></Display>
      <Segmented options={tabs} value={tabs[tab === 'org' ? 0 : 1]} onChange={v => setTab(v === tabs[0] ? 'org' : 'ven')} />
      {rows.map(r => {
        const on = !unfollowed[prefix + r.id];
        const open = () =>
          tab === 'org'
            ? router.push({ pathname: '/explore/organiser/[id]', params: { id: r.id } })
            : router.push({ pathname: '/explore/venue/[id]', params: { id: r.id } });
        return (
          <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18 }}>
            <Tap accessibilityRole="button" accessibilityLabel={`${r.name}, ${r.meta}`} onPress={open} style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {r.img ? <Image source={r.img} style={{ width: 52, height: 52, borderRadius: 14 }} /> : <Avatar initials={r.initials ?? ''} bg={r.bg} fg={r.fg} textSize={16} />}
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <T w={800} s={15}>{r.name}</T>
                <T s={12} color={c.muted}>{r.meta}</T>
              </View>
            </Tap>
            <Tap accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => toggle(prefix + r.id)} style={{ height: 36, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center', backgroundColor: on ? c.white : c.blue, borderWidth: on ? 1 : 0, borderColor: c.line }}>
              <T w={800} s={13} color={on ? c.ink : c.white}>{on ? 'Following' : 'Follow'}</T>
            </Tap>
          </View>
        );
      })}
      <T s={13} color={c.muted} align="center" style={{ marginTop: 'auto' }}>You&apos;ll get a notification when they announce new events.</T>
    </SettingsScreen>
  );
}
