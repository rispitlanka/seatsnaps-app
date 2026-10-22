import { useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

import { savedEvents } from '@/mocks/account';
import { Tap } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { SettingsScreen } from '@/ui/settings';
import { EmptyState } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const HEART = 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z';

/** Two tilted cards with a heart (L7 artwork). */
function SavedArt() {
  return (
    <View style={{ width: 150, height: 120 }}>
      <View style={{ position: 'absolute', left: 10, top: 18, width: 94, height: 94, borderRadius: 20, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, transform: [{ rotate: '-8deg' }] }} />
      <View style={{ position: 'absolute', left: 46, top: 8, width: 94, height: 94, borderRadius: 20, backgroundColor: c.blueSoft, borderWidth: 1, borderColor: c.blueSoftLine, transform: [{ rotate: '6deg' }], alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="heart" size={38} color={c.blue} />
      </View>
    </View>
  );
}

/** E4 Saved events; L7 once everything is un-saved. */
export default function SavedEvents() {
  const [saved, setSaved] = useState(savedEvents.map(e => e.id));
  const items = savedEvents.filter(e => saved.includes(e.id));

  if (!items.length) {
    return (
      <SettingsScreen>
        <Display>Saved <Hl>events.</Hl></Display>
        <EmptyState
          art={<SavedArt />}
          title="Nothing saved yet"
          body="Tap the heart on any event to keep it here. We'll remind you before tickets run out."
          action="Find events"
          onAction={() => router.dismissTo('/')}
        />
      </SettingsScreen>
    );
  }

  return (
    <SettingsScreen>
      <View style={{ gap: 8 }}>
        <Display>Saved <Hl>events.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>We&apos;ll remind you before tickets sell out.</T>
      </View>
      {items.map(e => (
        <View key={e.id}>
          <Tap accessibilityRole="button" accessibilityLabel={e.name} onPress={() => router.push({ pathname: '/event/[id]', params: { id: e.id } })} style={{ flexDirection: 'row', gap: 12, padding: 8, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20 }}>
            <Image source={e.img} style={{ width: 104, height: 104, borderRadius: 14 }} />
            <View style={{ flex: 1, minWidth: 0, paddingVertical: 4, paddingRight: 4, gap: 4 }}>
              <T w={800} s={12} color={c.blue} style={{ paddingRight: 26 }}>{e.date}</T>
              <T w={800} s={15}>{e.name}</T>
              <T s={12} color={c.muted}>{e.venue}</T>
              <View style={{ marginTop: 'auto', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <T w={800} s={14}>{e.price}</T>
                <T w={800} s={11} color={e.tagColor}>{e.tag}</T>
              </View>
            </View>
          </Tap>
          {/* Sibling of the card so it stays a separate control for screen readers. */}
          <Tap accessibilityRole="button" accessibilityLabel={`Remove ${e.name} from saved`} hitSlop={10} onPress={() => setSaved(list => list.filter(id => id !== e.id))} style={{ position: 'absolute', top: 12, right: 12 }}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill={c.blue} stroke={c.blue} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Path d={HEART} />
            </Svg>
          </Tap>
        </View>
      ))}
    </SettingsScreen>
  );
}
