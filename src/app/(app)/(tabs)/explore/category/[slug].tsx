import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { categories, categoryEvents } from '@/mocks/catalog';
import { img } from '@/ui/assets';
import { BackButton, CircleButton, Chip, DateBadge, Rail, Tap, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Display, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** C3 Category · Concerts. */
export default function Category() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const top = useTopPad();
  const name = categories.find(cat => cat.slug === slug)?.name ?? 'Concerts';
  const [active, setActive] = useState<Record<string, boolean>>({ 'This weekend': true, 'Under LKR 5,000': true, Free: false });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ paddingBottom: 28 }}>
      <StatusBar style="light" />
      <View style={{ height: 188 + top, backgroundColor: c.ink, overflow: 'hidden' }}>
        <Image source={img.concert} style={{ position: 'absolute', width: '100%', height: '100%' }} />
        <LinearGradient colors={['rgba(5,9,30,0.2)', 'rgba(5,9,30,0.85)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View style={{ position: 'absolute', top, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <BackButton variant="solid" />
          <CircleButton icon="search" label={`Search ${name.toLowerCase()}`} variant="solid" iconSize={19} stroke={2} onPress={() => router.push('/search')} />
        </View>
        <View style={{ position: 'absolute', left: 20, bottom: 22, gap: 8 }}>
          <Display color={c.white}>{name}</Display>
          <T s={14} color={c.blueSoftLine}>24 upcoming events in Colombo</T>
        </View>
      </View>

      <View style={{ paddingTop: 18, gap: 16 }}>
        <Rail gap={8}>
          <Chip label="Filters · 2" icon="sliders" active px={14} onPress={() => router.push('/filters')} />
          {Object.keys(active).map(label => (
            <Chip key={label} label={label} variant="soft" px={14} active={active[label]} onPress={() => setActive(a => ({ ...a, [label]: !a[label] }))} />
          ))}
        </Rail>

        <View style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <T w={700} s={14}>{categoryEvents.length} events match</T>
          <Tap accessibilityRole="button" accessibilityLabel="Sort: Soonest" style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <T s={14} color={c.ink2}>Sort: <T w={800} s={14}>Soonest</T></T>
            <Icon name="chevronDown" size={14} stroke={2.6} />
          </Tap>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {categoryEvents.map(e => (
            <Tap key={e.id} accessibilityRole="button" accessibilityLabel={e.name} onPress={() => router.push({ pathname: '/event/[id]', params: { id: e.id } })} style={{ flexDirection: 'row', gap: 12, padding: 8, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20 }}>
              <View style={{ width: 104, height: 104, borderRadius: 14, overflow: 'hidden', backgroundColor: c.ink }}>
                <Image source={e.img} style={{ width: '100%', height: '100%' }} />
                <View style={{ position: 'absolute', top: 6, left: 6 }}>
                  <DateBadge mon={e.mon} day={e.day} width={38} monSize={9} daySize={16} radius={10} py={4} />
                </View>
              </View>
              <View style={{ flex: 1, minWidth: 0, paddingVertical: 4, paddingRight: 6, gap: 4 }}>
                <T w={800} s={15} ls={-0.01}>{e.name}</T>
                <T s={12} color={c.muted}>{e.meta}</T>
                <T s={12} color={c.muted}>by {e.org}</T>
                <View style={{ marginTop: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <T w={800} s={14} color={c.blue}>{e.price}</T>
                  {e.tag ? <T w={700} s={11} color={c.urgent}>{e.tag}</T> : null}
                </View>
              </View>
            </Tap>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
