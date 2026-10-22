import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { legal } from '@/mocks/support';
import { Segmented, Tap } from '@/ui/components';
import { SettingsScreen } from '@/ui/settings';
import { Display, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const TABS = ['Terms of use', 'Privacy policy'];

/** J7 Terms & privacy. Reachable signed in or out (sign-up links here). */
export default function Legal() {
  const { tab: initial } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState(initial === 'privacy' ? TABS[1] : TABS[0]);
  const sections = tab === TABS[0] ? legal.terms : legal.privacy;

  return (
    <SettingsScreen background={c.white}>
      <Segmented options={TABS} value={tab} onChange={setTab} background={c.segmentAlt} />
      <View style={{ gap: 6 }}>
        <Display>{tab}</Display>
        <T s={13} color={c.muted}>Last updated [date]</T>
      </View>

      <View accessibilityLabel="On this page" style={{ backgroundColor: c.page, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, gap: 6 }}>
        <T w={800} s={12} ls={0.12} color={c.muted}>ON THIS PAGE</T>
        {sections.map((h, i) => (
          <Tap key={h} accessibilityRole="link" style={{ minHeight: 28, justifyContent: 'center' }}>
            <T w={700} s={14} color={c.blue}>{i + 1}. {h}</T>
          </Tap>
        ))}
      </View>

      {sections.map((h, i) => (
        <View key={h} style={{ gap: 8 }}>
          <T w={800} s={17} accessibilityRole="header">{i + 1}. {h}</T>
          <T s={14} lh={1.65} color={c.ink2}>[Legal copy for this section — supplied by SeatSnaps&apos; legal team. Body text is 14px on 1.65 line height for long-form reading.]</T>
        </View>
      ))}
    </SettingsScreen>
  );
}
