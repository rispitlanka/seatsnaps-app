import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';

import { Chip, Eyebrow, PrimaryButton, OutlineButton, Tap, goBack, useBottomPad, useTopPad } from '@/ui/components';
import { Display, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const DATES = ['Any time', 'Today', 'Tomorrow', 'This weekend', 'Pick dates'];
const CATS = ['Concerts', 'Festivals', 'Comedy', 'Sports', 'Meetups', 'Expos'];
const PRICES = ['Any', 'Free', 'Under 5k', '5k+'];
const DISTS = ['Any', '5 km', '10 km', '25 km'];

/** Four-up segmented choice used for price and distance. */
function Segments({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 6, padding: 4, backgroundColor: c.page, borderRadius: 16 }}>
      {options.map(option => {
        const on = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(option)}
            style={{ flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? c.white : 'transparent', boxShadow: on ? '0 2px 6px rgba(10,17,48,0.1)' : undefined }}
          >
            <T w={on ? 800 : 600} s={13} color={on ? c.ink : c.ink2}>{option}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

/** C8 Filters sheet. */
export default function Filters() {
  const top = useTopPad(66);
  const bottom = useBottomPad();
  const [date, setDate] = useState('This weekend');
  const [cats, setCats] = useState(['Concerts']);
  const [price, setPrice] = useState('Under 5k');
  const [dist, setDist] = useState('10 km');
  const active = (date !== 'Any time' ? 1 : 0) + cats.length + (price !== 'Any' ? 1 : 0) + (dist !== 'Any' ? 1 : 0);
  const apply = () => router.replace('/results');

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(10,17,48,0.72)' }}>
      <Pressable accessibilityLabel="Close filters" onPress={() => goBack()} style={{ height: top }} />
      <View accessibilityViewIsModal style={{ flex: 1, backgroundColor: c.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
        <View style={{ alignItems: 'center', paddingTop: 10 }}>
          <View style={{ width: 40, height: 5, borderRadius: 999, backgroundColor: c.dot }} />
        </View>
        <View style={{ paddingTop: 14, paddingHorizontal: 20, paddingBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Display size={24} ls={-0.02}>Filters</Display>
          <Tap
            accessibilityRole="button"
            onPress={() => {
              setDate('Any time');
              setCats([]);
              setPrice('Any');
              setDist('Any');
            }}
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <T w={700} s={14} color={c.blue}>Reset</T>
          </Tap>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 6, paddingHorizontal: 20, paddingBottom: 16, gap: 22 }}>
          <View style={{ gap: 10 }}>
            <Eyebrow>DATE</Eyebrow>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {DATES.map(d => <Chip key={d} label={d} active={date === d} onPress={() => (d === 'Pick dates' ? router.push('/dates') : setDate(d))} />)}
            </View>
          </View>
          <View style={{ gap: 10 }}>
            <Eyebrow>CATEGORY</Eyebrow>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {CATS.map(cat => (
                <Chip key={cat} label={cat} active={cats.includes(cat)} onPress={() => setCats(list => (list.includes(cat) ? list.filter(x => x !== cat) : [...list, cat]))} />
              ))}
            </View>
          </View>
          <View style={{ gap: 10 }}>
            <Eyebrow>PRICE</Eyebrow>
            <Segments options={PRICES} value={price} onChange={setPrice} />
          </View>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Eyebrow>DISTANCE</Eyebrow>
              <T w={700} s={13}>{dist === 'Any' ? 'Anywhere' : `Within ${dist}`}</T>
            </View>
            <Segments options={DISTS} value={dist} onChange={setDist} />
          </View>
        </ScrollView>

        <View style={{ paddingTop: 14, paddingHorizontal: 20, paddingBottom: bottom, borderTopWidth: 1, borderTopColor: c.line, flexDirection: 'row', gap: 10 }}>
          <OutlineButton label="Cancel" onPress={() => goBack()} style={{ width: 110 }} />
          <PrimaryButton label={active ? `Show results · ${active} filters` : 'Show all results'} onPress={apply} style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  );
}
