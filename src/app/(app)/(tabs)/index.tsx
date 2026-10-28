import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { listEventCategories, searchEvents } from '@/lib/api/events';
import { useResource } from '@/features/catalog/useResource';
import { ResourceState } from '@/features/catalog/components';
import { eventsInPeriod, homeCard, publicEvents } from '@/features/catalog/model';
const whenOptions = ['Any time', 'Today', 'This weekend'];
import { usePrefs } from '@/providers/prefs';
import { useSession } from '@/providers/session';
import { img } from '@/ui/assets';
import { Avatar, Chip, DateBadge, Dots, Rail, SearchLink, SectionHeader, Tap, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const openEvent = (id: string) => router.push({ pathname: '/event/[id]', params: { id } });

/** C1 Home. */
export default function Home() {
  const { user } = useSession();
  const { city } = usePrefs();
  const top = useTopPad();
  const [when, setWhen] = useState('Any time');
  const [slide, setSlide] = useState(0);
  const resource = useResource(`home:${city}`, async () => {
    const [events, categories] = await Promise.all([
      searchEvents({ where: city === 'All cities' ? undefined : city }), listEventCategories(),
    ]);
    return { events: publicEvents(events), categories };
  });
  const events = resource.data?.events ?? [];
  const featuredEvents = events.filter(event => event.is_featured);
  const featured = (featuredEvents.length ? featuredEvents : events.slice(0, 5)).map(homeCard);
  const homeCategories = (resource.data?.categories ?? []).map(category => ({ slug: category.slug, label: category.name, icon: 'grid' as const }));
  const weekend = eventsInPeriod(events, when).map(homeCard);
  const nearYou = events.map(homeCard);
  const topOrganisers = [...new Map(events.flatMap(event => event.organization ? [[event.organization.id, event.organization] as const] : [])).values()].map(org => ({
    id: org.id, name: org.name, initials: org.name.split(' ').slice(0, 2).map(word => word[0]).join(''),
    meta: `${events.filter(event => event.organization?.id === org.id).length} events`, bg: c.blue, fg: c.white,
  }));
  const initial = (user?.firstName || user?.username || user?.email || 'S').charAt(0).toUpperCase();

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={resource.loading} onRefresh={resource.retry} />} style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ paddingTop: top, paddingBottom: 28, gap: 28 }}>
      <StatusBar style="dark" />
      <View style={{ paddingHorizontal: 20, gap: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Image source={img.appIcon} style={{ width: 40, height: 40 }} accessibilityLabel="SeatSnaps" />
          <View style={{ flex: 1 }}>
            <T s={12} color={c.muted}>Events near</T>
            <Tap accessibilityRole="button" accessibilityLabel={`Change city, currently ${city}`} onPress={() => router.push('/city')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <T w={800} s={17} ls={-0.02}>{city}</T>
              <Icon name="chevronDown" size={15} stroke={2.6} />
            </Tap>
          </View>
          <Tap accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => router.push('/inbox')} style={{ width: 46, height: 46, borderRadius: 999, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bell" size={20} />
          </Tap>
          <Tap accessibilityRole="button" accessibilityLabel="Profile" onPress={() => router.navigate('/account')}>
            <Avatar initials={initial} size={44} textSize={15} />
          </Tap>
        </View>

        <Display>{"What's on\n"}<Hl>tonight?</Hl></Display>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <SearchLink placeholder="Search events, artists, venues" onPress={() => router.push('/search')} style={{ flex: 1 }} />
          <Tap accessibilityRole="button" accessibilityLabel="Filters" onPress={() => router.push('/results')} style={{ width: 52, height: 52, alignSelf: 'center', borderRadius: 16, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="sliders" size={20} color={c.white} />
          </Tap>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20 }}><ResourceState {...resource} empty={!!resource.data && !events.length} emptyText={`No published events in ${city}. Try another city or All cities.`} /></View>
      <Rail>
        {homeCategories.map((cat, i) => (
          <CategoryTile key={cat.slug} label={cat.label} icon={cat.icon} active={false} onPress={() => router.push({ pathname: '/explore/category/[slug]', params: { slug: cat.slug } })} />
        ))}
        <CategoryTile label="All" icon="grid" onPress={() => router.navigate('/explore')} />
      </Rail>

      <View style={{ gap: 14 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <SectionHeader action="See all" onAction={() => router.push('/results')}>
            <Display size={18}>{"Don't miss "}<Hl>these</Hl></Display>
          </SectionHeader>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={312}
          decelerationRate="fast"
          contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
          onScroll={e => setSlide(Math.round(e.nativeEvent.contentOffset.x / 312))}
          scrollEventThrottle={32}
        >
          {featured.map(f => (
            <Tap key={f.name} accessibilityRole="button" accessibilityLabel={f.name} onPress={() => openEvent(f.id)} style={{ width: 300, height: 360, borderRadius: 26, overflow: 'hidden', backgroundColor: c.ink }}>
              <Image source={f.img} style={{ position: 'absolute', width: '100%', height: '100%' }} />
              <LinearGradient colors={['rgba(5,9,30,0)', 'rgba(5,9,30,0.92)']} locations={[0, 0.7]} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 200 }} />
              <View style={{ position: 'absolute', top: 14, left: 14 }}>
                <DateBadge mon={f.mon} day={f.day} />
              </View>
              <View style={{ position: 'absolute', top: 14, right: 14, height: 28, paddingHorizontal: 12, borderRadius: 999, backgroundColor: 'rgba(10,17,48,0.72)', justifyContent: 'center' }}>
                <T w={700} s={12} color={c.white}>{f.cat}</T>
              </View>
              <View style={{ position: 'absolute', left: 18, right: 18, bottom: 18, gap: 12 }}>
                <View style={{ gap: 4 }}>
                  <T w={800} s={22} lh={1.05} ls={-0.02} upper color={c.white}>{f.name}</T>
                  <T s={13} color={c.blueSoftLine}>{f.meta}</T>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <T w={800} s={16} color={c.white}>{f.price}</T>
                  <View style={{ height: 40, paddingHorizontal: 18, borderRadius: 999, backgroundColor: c.blue, justifyContent: 'center' }}>
                    <T w={700} s={14} color={c.white}>View event</T>
                  </View>
                </View>
              </View>
            </Tap>
          ))}
        </ScrollView>
        <View style={{ alignItems: 'center' }}>
          {featured.length ? <Dots count={featured.length} active={Math.min(slide, featured.length - 1)} /> : null}
        </View>
      </View>

      <View style={{ gap: 14 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <SectionHeader action="See all" onAction={() => router.push('/results')}>
            <Display size={18}>Browse <Hl>events</Hl></Display>
          </SectionHeader>
        </View>
        <Rail gap={8}>
          {whenOptions.map(option => (
            <Chip key={option} label={option} active={when === option} height={when === option ? 40 : 42} onPress={() => setWhen(option)} />
          ))}
        </Rail>
        {!resource.loading && resource.data && !weekend.length ? <View style={{ paddingHorizontal: 20 }}><T color={c.muted}>No events in this date range.</T></View> : null}
        <Rail>
          {weekend.map(e => (
            <Tap key={e.name} accessibilityRole="button" accessibilityLabel={e.name} onPress={() => openEvent(e.id)} style={{ width: 210, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, padding: 8, gap: 10 }}>
              <View style={{ height: 120, borderRadius: 14, overflow: 'hidden', backgroundColor: c.ink }}>
                <Image source={e.img} style={{ width: '100%', height: '100%' }} />
                <View style={{ position: 'absolute', top: 8, left: 8, height: 26, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.white, justifyContent: 'center' }}>
                  <T w={800} s={11}>{e.date}</T>
                </View>
              </View>
              <View style={{ paddingHorizontal: 6, paddingBottom: 6, gap: 4 }}>
                <T w={800} s={15} ls={-0.01}>{e.name}</T>
                <T s={12} color={c.muted}>{e.meta}</T>
                <T w={800} s={14} color={c.blue} style={{ marginTop: 4 }}>{e.price}</T>
              </View>
            </Tap>
          ))}
        </Rail>
      </View>

      <View style={{ gap: 14 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <SectionHeader action="See all" onAction={() => router.navigate({ pathname: '/explore', params: { tab: 'Organisers' } })}>
            <Display size={18}>Event <Hl>organisers</Hl></Display>
          </SectionHeader>
        </View>
        <Rail>
          {topOrganisers.map(o => (
            <Tap key={o.id} accessibilityRole="button" accessibilityLabel={o.name} onPress={() => router.push({ pathname: '/explore/organiser/[id]', params: { id: o.id } })} style={{ width: 132, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingVertical: 16, paddingHorizontal: 12, alignItems: 'center', gap: 10 }}>
              <Avatar initials={o.initials} size={64} bg={o.bg} fg={o.fg} textSize={20} />
              <View style={{ gap: 2, alignItems: 'center' }}>
                <T w={800} s={13} lh={1.25} align="center">{o.name}</T>
                <T s={11} color={c.muted}>{o.meta}</T>
              </View>
              <View style={{ height: 32, paddingHorizontal: 16, borderRadius: 999, backgroundColor: c.blueSoft, justifyContent: 'center' }}>
                <T w={800} s={12} color={c.blueDeep}>View</T>
              </View>
            </Tap>
          ))}
        </Rail>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 14 }}>
        <SectionHeader action="Venues" onAction={() => router.navigate({ pathname: '/explore', params: { tab: 'Venues' } })}>
          <Display size={18}>Near <Hl>you</Hl></Display>
        </SectionHeader>
        {nearYou.map(n => (
          <Tap key={n.name} accessibilityRole="button" accessibilityLabel={n.name} onPress={() => openEvent(n.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18 }}>
            <Image source={n.img} style={{ width: 76, height: 76, borderRadius: 12 }} />
            <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
              <T w={700} s={12} color={c.blue}>{n.date}</T>
              <T w={800} s={15} ls={-0.01}>{n.name}</T>
              <T s={12} color={c.muted}>{n.meta}</T>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6, paddingRight: 8 }}>
              <T w={800} s={14}>{n.price}</T>
              <T s={11} color={c.muted}>{n.dist}</T>
            </View>
          </Tap>
        ))}
      </View>

      <View style={{ marginHorizontal: 20, borderRadius: 24, backgroundColor: c.ink, padding: 22, gap: 12, overflow: 'hidden' }}>
        <Image source={img.watermark} style={{ position: 'absolute', width: 220, height: 220, right: -60, bottom: -70, opacity: 0.1 }} />
        <T w={700} s={11} ls={0.2} color={c.periwinkle}>FOR ORGANISERS</T>
        <Display size={24} color={c.white} accent={c.blueBright}>{'Hosting an\n'}<Hl>event?</Hl></Display>
        <T s={14} lh={1.5} color={c.onDarkMuted} style={{ maxWidth: 240 }}>Sell seats, scan tickets and see your sales live — all from SeatSnaps.</T>
        <Tap accessibilityRole="button" onPress={() => router.push('/become-organiser')} style={{ alignSelf: 'flex-start', marginTop: 4, height: 44, paddingHorizontal: 20, borderRadius: 999, backgroundColor: c.white, justifyContent: 'center' }}>
          <T w={800} s={14}>Become an organiser</T>
        </Tap>
      </View>
    </ScrollView>
  );
}

function CategoryTile({ label, icon, active, onPress }: { label: string; icon: Parameters<typeof Icon>[0]['name']; active?: boolean; onPress?: () => void }) {
  return (
    <Tap accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ width: 68, alignItems: 'center', gap: 8 }}>
      <View style={{ width: active ? 60 : 62, height: active ? 60 : 62, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? c.blue : c.white, borderWidth: active ? 0 : 1, borderColor: c.line }}>
        <Icon name={icon} size={24} color={active ? c.white : c.blue} />
      </View>
      <T w={700} s={12}>{label}</T>
    </Tap>
  );
}
