import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { categories, organiserFilters, organisers } from '@/mocks/catalog';
import { venueFilters, venuesList } from '@/mocks/support';
import { img } from '@/ui/assets';
import { Avatar, Chip, FollowPill, Rail, SearchLink, Segmented, Tap, useTopPad } from '@/ui/components';
import { VerifiedIcon } from '@/ui/Icon';
import { OrganiserRow } from '@/ui/rows';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const TABS = ['Categories', 'Organisers', 'Venues'];

/** C2 Explore · Categories and C4 Explore · Organisers. */
export default function Explore() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const top = useTopPad();
  const [tab, setTab] = useState(TABS.includes(params.tab ?? '') ? params.tab! : 'Categories');
  const [filter, setFilter] = useState('All');
  const [venueFilter, setVenueFilter] = useState('Nearest');
  const [following, setFollowing] = useState<Record<string, boolean>>(() => Object.fromEntries(organisers.map(o => [o.id, !!o.following])));
  const toggle = (id: string) => setFollowing(f => ({ ...f, [id]: !f[id] }));
  const openPulse = () => router.push({ pathname: '/explore/organiser/[id]', params: { id: 'pulse-live-lk' } });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ paddingTop: top, paddingHorizontal: 20, paddingBottom: 20, gap: 18 }}>
      <StatusBar style="dark" />
      <Display>Explore <Hl>events.</Hl></Display>
      <Segmented options={TABS} value={tab} onChange={setTab} />
      <SearchLink placeholder={`Search ${tab.toLowerCase()}`} onPress={() => router.push('/search')} />

      {tab === 'Categories' ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {categories.map(cat => (
            <Tap
              key={cat.slug}
              accessibilityRole="button"
              accessibilityLabel={`${cat.name}, ${cat.count}`}
              onPress={() => router.push({ pathname: '/explore/category/[slug]', params: { slug: cat.slug } })}
              style={{ flexGrow: 1, flexBasis: '40%', height: 112, borderRadius: 20, overflow: 'hidden', backgroundColor: c.ink }}
            >
              <Image source={cat.img} style={{ position: 'absolute', width: '100%', height: '100%' }} />
              <LinearGradient colors={['rgba(5,9,30,0.05)', 'rgba(5,9,30,0.85)']} locations={[0.2, 1]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
              <View style={{ position: 'absolute', left: 14, bottom: 12, gap: 2 }}>
                <T w={800} s={16} ls={-0.01} color={c.white}>{cat.name}</T>
                <T s={12} color={c.blueSoftLine}>{cat.count}</T>
              </View>
            </Tap>
          ))}
        </View>
      ) : null}

      {tab === 'Organisers' ? (
        <>
          <View style={{ marginHorizontal: -20 }}>
            <Rail gap={8}>
              {organiserFilters.map(f => (
                <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
              ))}
            </Rail>
          </View>

          <View style={{ borderRadius: 24, overflow: 'hidden', backgroundColor: c.ink }}>
            <Tap accessibilityRole="button" accessibilityLabel="Pulse Live LK, featured, Concerts · 8 upcoming" onPress={openPulse} style={{ height: 92 }}>
              <Image source={img.concert} style={{ width: '100%', height: '100%' }} />
              <View style={{ position: 'absolute', top: 12, left: 12, height: 26, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.white, justifyContent: 'center' }}>
                <T w={800} s={11} ls={0.06}>FEATURED</T>
              </View>
            </Tap>
            <View style={{ paddingHorizontal: 16, paddingBottom: 16, marginTop: -26, flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
              <Tap accessible={false} onPress={openPulse} style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
                <Avatar initials="PL" size={72} bg={c.blue} textSize={20} border={{ width: 4, color: c.ink }} />
                <View style={{ flex: 1, gap: 2, paddingBottom: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <T w={800} s={16} color={c.white}>Pulse Live LK</T>
                    <VerifiedIcon size={16} color={c.blueBright} />
                  </View>
                  <T s={12} color={c.onDarkMuted}>Concerts · 8 upcoming</T>
                </View>
              </Tap>
              <FollowPill dark following={following['pulse-live-lk']} onPress={() => toggle('pulse-live-lk')} />
            </View>
          </View>

          <View style={{ gap: 10 }}>
            {organisers
              .filter(o => (filter === 'Following' ? following[o.id] : filter === 'Verified' ? o.verified : true))
              .map(o => (
                <OrganiserRow key={o.id} org={o} following={following[o.id]} onFollow={() => toggle(o.id)} />
              ))}
          </View>
        </>
      ) : null}

      {tab === 'Venues' ? (
        <>
          <View style={{ marginHorizontal: -20 }}>
            <Rail gap={8}>
              {venueFilters.map(f => (
                <Chip key={f} label={f} active={venueFilter === f} onPress={() => setVenueFilter(f)} />
              ))}
            </Rail>
          </View>
          {venuesList.map(v => (
            <Tap key={v.id} accessibilityRole="button" accessibilityLabel={v.name} onPress={() => router.push({ pathname: '/explore/venue/[id]', params: { id: v.id } })} style={{ flexDirection: 'row', gap: 12, padding: 8, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20 }}>
              <Image source={v.img} style={{ width: 96, height: 96, borderRadius: 14 }} />
              <View style={{ flex: 1, minWidth: 0, paddingVertical: 4, paddingRight: 6, gap: 4 }}>
                <T w={800} s={15}>{v.name}</T>
                <T s={12} color={c.muted}>{v.type} · {v.area}</T>
                <View style={{ marginTop: 'auto', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <T w={800} s={12} color={c.blue}>{v.events}</T>
                  <T s={12} color={c.muted}>{v.dist}</T>
                </View>
              </View>
            </Tap>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}
