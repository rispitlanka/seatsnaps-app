import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import type { ListDesign } from '../design-model';
import type { ImageSource } from 'expo-image';

import { BackButton, Chip, DateBadge, Eyebrow, Rail, Tap, UnderlineTabs, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { OrganiserRow, VenueRow } from '@/ui/rows';
import { ResultBadge } from '@/ui/states';
import { T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** Highlights the matched term like the board's <mark>. */
function Mark({ text, term, s, w = 800 }: { text: string; term: string; s: number; w?: 800 }) {
  const i = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1;
  if (i < 0) return <T w={w} s={s}>{text}</T>;
  return (
    <T w={w} s={s} ls={-0.01}>
      {text.slice(0, i)}
      <Text style={{ backgroundColor: c.blueSoft, color: c.blueDeep }}>{'\u200A' + text.slice(i, i + term.length) + '\u200A'}</Text>
      {text.slice(i + term.length)}
    </T>
  );
}

const openEvent = (id: string) => router.push({ pathname: '/event/[id]', params: { id } });

function PopularRow({ img: source, date, name, price, id }: { img: ImageSource | null; date: string; name: string; price: string; id: string }) {
  return (
    <Tap accessibilityRole="button" accessibilityLabel={name} onPress={() => openEvent(id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18 }}>
      <Image source={source} style={{ width: 64, height: 64, borderRadius: 12 }} />
      <View style={{ flex: 1, gap: 3 }}>
        <T w={800} s={12} color={c.blue}>{date}</T>
        <T w={800} s={15}>{name}</T>
      </View>
      <T w={800} s={14} style={{ paddingRight: 8 }}>{price}</T>
    </Tap>
  );
}

/** H3 Search · no results. */
function NoResults({ q, model }: { q: string; model: ListDesign }) {
  const top = useTopPad();
  const search = (term: string) => router.replace({ pathname: '/results', params: { q: term } });
  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <StatusBar style="dark" />
      <View style={{ backgroundColor: c.white, paddingTop: top, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: c.line, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <BackButton />
        <Tap accessibilityRole="search" accessibilityLabel={`Edit search: ${q}`} onPress={() => router.back()} style={{ flex: 1, height: 50, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.page, borderWidth: 1, borderColor: c.line, borderRadius: 14 }}>
          <Icon name="search" size={18} color={c.muted} />
          <T w={700} s={15}>{q}</T>
        </Tap>
      </View>
      <ScrollView contentContainerStyle={{ paddingTop: 26, paddingHorizontal: 20, paddingBottom: 30, gap: 22 }}>
        <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 24, paddingVertical: 30, paddingHorizontal: 22, alignItems: 'center', gap: 12 }}>
          <ResultBadge icon="searchMinus" bg={c.blueSoft} color={c.blue} size={72} iconSize={30} stroke={2} />
          <T w={800} s={18} align="center">No results for “{q}”</T>
          <T s={14} lh={1.5} color={c.ink2} align="center">Check the spelling, try a broader word, or remove some filters.</T>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <Tap accessibilityRole="button" onPress={() => search('')} style={{ height: 40, paddingHorizontal: 16, borderRadius: 999, backgroundColor: c.ink, justifyContent: 'center' }}>
              <T w={700} s={14} color={c.white}>Clear filters</T>
            </Tap>
            <Tap accessibilityRole="button" onPress={() => router.push('/city')} style={{ height: 42, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: c.line, justifyContent: 'center' }}>
              <T w={700} s={14}>Change city</T>
            </Tap>
          </View>
        </View>
        <View style={{ gap: 10 }}>
          <Eyebrow>TRY SEARCHING</Eyebrow>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {model.categories.slice(0, 3).map(category => category.name).map(term => (
              <Tap key={term} accessibilityRole="link" onPress={() => search(term)} style={{ height: 42, paddingHorizontal: 14, borderRadius: 999, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, justifyContent: 'center' }}>
                <T w={600} s={14}>{term}</T>
              </Tap>
            ))}
          </View>
        </View>
        <View style={{ gap: 10 }}>
          <Eyebrow>MORE EVENTS</Eyebrow>
          {model.categoryEvents.slice(0, 2).map(event => <PopularRow key={event.id} {...event} />)}
        </View>
      </ScrollView>
    </View>
  );
}

/** C7 Search results. */
export default function Results({ model, q, filters }: { model: ListDesign; q: string; filters?: import('react').ReactNode }) {
  const resultEvents = model.resultEvents.slice(1);
  const resultVenues = model.resultVenues;
  const first = model.resultEvents[0];
  const top = useTopPad();
  const [tab, setTab] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  if (!model.resultEvents.length && !model.resultVenues.length && !model.organisers.length) return <NoResults q={q} model={model} />;

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <StatusBar style="dark" />
      <View style={{ backgroundColor: c.white, paddingTop: top, paddingHorizontal: 20, gap: 14, borderBottomWidth: 1, borderBottomColor: c.line }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <BackButton />
          <Tap accessibilityRole="search" accessibilityLabel={`Edit search: ${q}`} onPress={() => router.back()} style={{ flex: 1, height: 50, paddingLeft: 14, paddingRight: 6, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.page, borderWidth: 1, borderColor: c.line, borderRadius: 14 }}>
            <Icon name="search" size={18} color={c.muted} />
            <T w={700} s={15} style={{ flex: 1 }}>{q}</T>
            <View style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="close" size={16} color={c.muted} stroke={2.2} />
            </View>
          </Tap>
        </View>
        <UnderlineTabs options={['All', `Events (${model.resultEvents.length})`, `Organisers (${model.organisers.length})`, `Venues (${resultVenues.length})`]} value={tab} onChange={setTab} gap={22} s={14} />
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 20, paddingBottom: 28, gap: 22 }}>
        {(tab === 'All' || tab.startsWith('Events')) && first ? (
          <View style={{ gap: 12 }}>
            <Eyebrow>TOP RESULT</Eyebrow>
            <Tap accessibilityRole="button" accessibilityLabel={first.name} onPress={() => openEvent(first.id)} style={{ borderRadius: 22, overflow: 'hidden', backgroundColor: c.white, borderWidth: 1, borderColor: c.line }}>
              <View style={{ height: 150, backgroundColor: c.ink }}>
                <Image source={first.img} accessibilityLabel={first.name} style={{ width: '100%', height: '100%' }} />
                <View style={{ position: 'absolute', top: 12, left: 12 }}>
                  <DateBadge mon={first.mon} day={first.day} width={48} daySize={20} radius={12} py={6} />
                </View>
              </View>
              <View style={{ paddingTop: 14, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Mark text={first.name} term={q} s={17} />
                  <T s={13} color={c.muted}>{first.meta}</T>
                </View>
                <View style={{ height: 36, paddingHorizontal: 14, borderRadius: 999, backgroundColor: c.blue, justifyContent: 'center' }}>
                  <T w={700} s={13} color={c.white}>{first.price}</T>
                </View>
              </View>
            </Tap>
          </View>
        ) : null}

        <View style={{ marginHorizontal: -20 }}><Rail gap={8}>
          <Chip label="Filters" icon="sliders" active={showFilters} px={14} onPress={() => setShowFilters(value => !value)} />
          <Chip label="Any date" trailing="chevronDown" px={14} onPress={() => setShowFilters(true)} />
          <Chip label="Price" trailing="chevronDown" px={14} onPress={() => setShowFilters(true)} />
          <Chip label="Location" trailing="chevronDown" px={14} onPress={() => setShowFilters(true)} />
        </Rail></View>
        {showFilters ? filters : null}
        {tab === 'All' || tab.startsWith('Organisers') ? (
          <View style={{ gap: 12 }}>
            <Eyebrow>ORGANISERS</Eyebrow>
            {model.organisers.map(org => <OrganiserRow key={org.id} org={org} title={<Mark text={org.name} term={q} s={15} />} />)}
          </View>
        ) : null}

        {tab === 'All' || tab.startsWith('Events') ? (
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <Eyebrow>EVENTS</Eyebrow>
              <Tap accessibilityRole="button" onPress={() => setTab(`Events (${model.resultEvents.length})`)}>
                <T w={700} s={13} color={c.blue}>See all {model.resultEvents.length}</T>
              </Tap>
            </View>
            {resultEvents.map(e => (
              <Tap key={e.id} accessibilityRole="button" accessibilityLabel={e.name} onPress={() => openEvent(e.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18 }}>
                <Image source={e.img} style={{ width: 72, height: 72, borderRadius: 12 }} />
                <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                  <T w={700} s={12} color={c.blue}>{e.date}</T>
                  <T w={800} s={15} ls={-0.01}>{e.name}</T>
                  <T s={12} color={c.muted}>{e.venue}</T>
                </View>
                <T w={800} s={14} style={{ paddingRight: 8 }}>{e.price}</T>
              </Tap>
            ))}
          </View>
        ) : null}

        {tab === 'All' || tab.startsWith('Venues') ? (
          <View style={{ gap: 12 }}>
            <Eyebrow>VENUES</Eyebrow>
            {resultVenues.map(v => (
              <VenueRow key={v.id} name={v.name} meta={v.meta} onPress={() => router.push({ pathname: '/explore/venue/[id]', params: { id: v.id } })} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
