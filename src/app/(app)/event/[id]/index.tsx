import { useState } from 'react';
import { ScrollView, Share, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { event, lkr, tiers } from '@/mocks/catalog';
import { kindOf } from '@/mocks/support';
import { Cancelled, Postponed, SoldOut } from '@/screens/EventStates';
import { img } from '@/ui/assets';
import { Avatar, BackButton, CircleButton, Footer, PrimaryButton, Rail, SectionHeader, Tap, useTopPad } from '@/ui/components';
import { Icon, VerifiedIcon } from '@/ui/Icon';
import { OrganiserRow } from '@/ui/rows';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function Label({ children }: { children: string }) {
  return <T w={800} s={11} ls={0.2} color={c.blue}>{children}</T>;
}

const card = { backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20 } as const;

/** First ticket step for each kind of event. */
function ticketPath(id: string) {
  switch (kindOf(id)) {
    case 'ga':
      return '/event/[id]/admission' as const;
    case 'rsvp':
      return '/event/[id]/rsvp' as const;
    case 'multi':
      return '/event/[id]/shows' as const;
    default:
      return '/event/[id]/select' as const;
  }
}

/** Event page: D1 detail, or the sold-out / cancelled / postponed state (I6–I8). */
export default function EventRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const kind = kindOf(id);
  if (kind === 'soldout') return <SoldOut />;
  if (kind === 'cancelled') return <Cancelled />;
  if (kind === 'postponed') return <Postponed />;
  return <EventDetail id={id} />;
}

/** D1 Event detail. */
function EventDetail({ id }: { id: string }) {
  const top = useTopPad();
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const toOrganiser = () => router.push({ pathname: '/explore/organiser/[id]', params: { id: event.organiser.id } });

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ height: 328 + top, backgroundColor: c.ink }}>
          <Image source={event.img} accessibilityLabel="Festival crowd under bunting and string lights" style={{ width: '100%', height: '100%' }} />
          <View style={{ position: 'absolute', top, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <BackButton variant="solid" />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <CircleButton icon="share" label="Share" variant="solid" iconSize={19} stroke={2} onPress={() => Share.share({ message: `${event.fullName} on SeatSnaps` })} />
              <CircleButton icon="bookmark" label={saved ? 'Saved' : 'Save'} variant="solid" iconSize={19} stroke={2} color={saved ? c.blue : c.ink} onPress={() => setSaved(s => !s)} />
            </View>
          </View>
          <View style={{ position: 'absolute', left: 20, bottom: 44, height: 28, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.blue, justifyContent: 'center' }}>
            <T w={700} s={12} color={c.white}>{event.category}</T>
          </View>
        </View>

        <View style={{ marginTop: -28, backgroundColor: c.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 24, paddingHorizontal: 20, paddingBottom: 26, gap: 18 }}>
          <View style={{ gap: 10 }}>
            <Display>{event.name} <Hl>{event.nameAccent}</Hl></Display>
            <Tap accessibilityRole="link" onPress={toOrganiser} style={{ alignSelf: 'flex-start', minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Avatar initials={event.organiser.initials} size={26} textSize={10} />
              <T s={13} color={c.ink2}>by <T w={800} s={13}>{event.organiser.name}</T></T>
              <VerifiedIcon />
            </Tap>
          </View>

          <View style={{ borderWidth: 1, borderColor: c.line, borderRadius: 20 }}>
            <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: c.lineSoft }}>
              <View style={{ width: 56, height: 60, borderRadius: 14, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} s={10} color={c.periwinkle}>{event.mon}</T>
                <T w={800} s={24} lh={1} color={c.white}>{event.day}</T>
                <T w={700} s={9} color={c.onDarkMuted}>{event.weekday}</T>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <T w={800} s={15}>{event.time}</T>
                <T s={12} color={c.muted}>{event.doors}</T>
              </View>
              <Tap accessibilityRole="button" accessibilityLabel="Add to calendar" style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="calendarPlus" size={20} color={c.blue} />
              </Tap>
            </View>
            <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: c.page, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="pin" size={22} color={c.blue} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <T w={800} s={15}>{event.venue}</T>
                <T s={12} color={c.muted}>{event.address}</T>
              </View>
              <Tap accessibilityRole="button" accessibilityLabel="Get directions" style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="navigate" size={20} color={c.blue} />
              </Tap>
            </View>
          </View>

          <View style={{ backgroundColor: c.ink, borderRadius: 20, padding: 16, gap: 12 }}>
            <T w={700} s={11} ls={0.2} color={c.periwinkle} align="center">EVENT STARTS IN</T>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {event.countdown.map(([value, unit]) => (
                <View key={unit} style={{ flex: 1, backgroundColor: c.navy, borderRadius: 14, paddingVertical: 10, alignItems: 'center', gap: 2 }}>
                  <T w={800} s={26} lh={1} color={c.white}>{value}</T>
                  <T s={11} color={c.onDarkMuted}>{unit}</T>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ paddingTop: 26, paddingHorizontal: 20, gap: 30 }}>
          <View style={{ gap: 12 }}>
            <Label>ABOUT THE SHOW</Label>
            <T s={14} lh={1.6} color={c.ink2} numberOfLines={expanded ? undefined : 4}>{event.about}</T>
            <Tap accessibilityRole="button" onPress={() => setExpanded(e => !e)} style={{ alignSelf: 'flex-start', minHeight: 32, justifyContent: 'center' }}>
              <T w={800} s={14} color={c.blue}>{expanded ? 'Show less' : 'Read more'}</T>
            </Tap>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {event.tags.map(tag => (
                <View key={tag} style={{ height: 34, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, justifyContent: 'center' }}>
                  <T w={700} s={12}>{tag}</T>
                </View>
              ))}
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <Label>TICKETS</Label>
            <Display size={22}>Choose your <Hl>ticket</Hl></Display>
            <View style={card}>
              {tiers.map((t, i) => (
                <View key={t.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: i < tiers.length - 1 ? 1 : 0, borderBottomColor: c.lineSoft }}>
                  <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: t.dot }} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <T w={800} s={15}>{t.name}</T>
                    <T s={12} color={t.fast ? c.urgent : c.muted}>{t.avail}</T>
                  </View>
                  <T w={800} s={15}>{lkr(t.price)}</T>
                </View>
              ))}
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <Label>SEATING</Label>
            <Display size={22}>{"Where you'll "}<Hl>be sitting</Hl></Display>
            <Tap accessibilityRole="button" accessibilityLabel="View full seat map" onPress={() => router.push({ pathname: '/event/[id]/section', params: { id } })} style={{ ...card, paddingVertical: 18, paddingHorizontal: 16, gap: 10 }}>
              <View style={{ alignSelf: 'center', width: '70%', height: 30, borderBottomLeftRadius: 60, borderBottomRightRadius: 60, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} s={10} ls={0.24} color={c.white}>STAGE</T>
              </View>
              {[
                { label: 'VIP', h: 42, bg: c.ink, fg: c.white, mx: 26 },
                { label: 'GOLD', h: 56, bg: c.blue, fg: c.white, mx: 12 },
                { label: 'SILVER', h: 56, bg: c.periwinkle, fg: c.ink, mx: 0 },
                { label: 'BALCONY', h: 40, bg: c.pale, fg: c.ink, mx: 0 },
              ].map(b => (
                <View key={b.label} style={{ height: b.h, marginHorizontal: b.mx, borderRadius: 12, backgroundColor: b.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <T w={800} s={12} color={b.fg}>{b.label}</T>
                </View>
              ))}
              <T w={800} s={13} color={c.blue} align="center" style={{ marginTop: 4 }}>View full seat map</T>
            </Tap>
          </View>

          <View style={{ gap: 12 }}>
            <Label>VENUE</Label>
            <View style={{ ...card, overflow: 'hidden' }}>
              <Image source={img.theatre} accessibilityLabel="Theatre exterior at night" style={{ width: '100%', height: 170 }} />
              <View style={{ paddingTop: 14, paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
                <View style={{ gap: 3 }}>
                  <T w={800} s={16}>{event.venue}</T>
                  <T s={12} color={c.muted}>{event.address}</T>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Tap accessibilityRole="button" onPress={() => router.push({ pathname: '/explore/venue/[id]', params: { id: 'nelum-pokuna-theatre' } })} style={{ flex: 1, height: 46, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
                    <T w={700} s={14}>View venue</T>
                  </Tap>
                  <Tap accessibilityRole="button" style={{ flex: 1, height: 44, borderRadius: 999, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
                    <T w={800} s={14} color={c.blueDeep}>Get directions</T>
                  </Tap>
                </View>
              </View>
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <Label>GOOD TO KNOW</Label>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {event.facts.map(f => (
                <View key={f.k} style={{ flexGrow: 1, flexBasis: '40%', backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, gap: 2 }}>
                  <T s={12} color={c.muted}>{f.k}</T>
                  <T w={800} s={14}>{f.v}</T>
                </View>
              ))}
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <Label>ORGANISED BY</Label>
            <OrganiserRow
              org={{ id: event.organiser.id, initials: event.organiser.initials, name: event.organiser.name, meta: event.organiser.upcoming, bg: c.ink, fg: c.white }}
              following={following}
              onFollow={() => setFollowing(f => !f)}
              padding={{ v: 12, h: 12 }}
            />
          </View>

          <View style={{ gap: 12 }}>
            <SectionHeader action="See all" onAction={() => router.push({ pathname: '/explore/category/[slug]', params: { slug: 'festivals' } })}>
              <Display size={18}>More <Hl>festivals</Hl></Display>
            </SectionHeader>
            <View style={{ marginHorizontal: -20 }}>
              <Rail>
                {event.more.map(e => (
                  <Tap key={e.id} accessibilityRole="button" accessibilityLabel={e.name} onPress={() => router.push({ pathname: '/event/[id]', params: { id: e.id } })} style={{ width: 200, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, padding: 8, gap: 10 }}>
                    <Image source={e.img} style={{ width: '100%', height: 110, borderRadius: 14 }} />
                    <View style={{ paddingHorizontal: 6, paddingBottom: 6, gap: 4 }}>
                      <T w={700} s={12} color={c.blue}>{e.date}</T>
                      <T w={800} s={14}>{e.name}</T>
                      <T w={800} s={13} style={{ marginTop: 2 }}>{e.price}</T>
                    </View>
                  </Tap>
                ))}
              </Rail>
            </View>
          </View>
        </View>
      </ScrollView>

      <Footer>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <View style={{ gap: 2 }}>
            <T s={12} color={c.muted}>From</T>
            <T w={800} s={20} ls={-0.02}>{event.fromPrice}</T>
          </View>
          <PrimaryButton label="Get tickets" onPress={() => router.push({ pathname: ticketPath(id), params: { id } })} style={{ flex: 1, maxWidth: 210 }} />
        </View>
      </Footer>
    </View>
  );
}
