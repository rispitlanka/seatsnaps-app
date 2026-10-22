import { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { CircleButton, QrPattern, Tap, goBack, useBottomPad, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** J4 Gate mode: full-screen offline QR for each ticket. */
export default function GateMode() {
  const top = useTopPad();
  const bottom = useBottomPad(34);
  const [i, setI] = useState(0);
  const seat = i ? 'G6' : 'G5';

  return (
    <View style={{ flex: 1, backgroundColor: c.white, alignItems: 'center', paddingTop: top, paddingHorizontal: 24, paddingBottom: bottom, gap: 18 }}>
      <StatusBar style="dark" />
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.successSoft, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="check" size={14} color={c.success} stroke={2.6} />
          <T w={800} s={12} color={c.success}>Works offline</T>
        </View>
        <CircleButton icon="close" label="Close" onPress={() => goBack()} />
      </View>

      <View style={{ alignItems: 'center', gap: 4 }}>
        <T w={800} s={20} ls={-0.02} upper>Tamil Fest 2026</T>
        <T s={13} color={c.muted}>Sat 24 Oct · Doors 6:45 PM · Gate B</T>
      </View>

      <View style={{ padding: 18, borderRadius: 28, borderWidth: 2, borderColor: c.ink }}>
        <QrPattern key={seat} n={21} size={250} seed={i ? 41 : 17} />
      </View>

      <View style={{ width: '100%', flexDirection: 'row' }}>
        {[
          ['Section', 'Gold C'],
          ['Row', 'G'],
        ].map(([k, v]) => (
          <View key={k} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
            <T s={12} color={c.muted}>{k}</T>
            <T w={800} s={18}>{v}</T>
          </View>
        ))}
        <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
          <T s={12} color={c.muted}>Seat</T>
          <T w={800} s={30} lh={0.9} color={c.blue}>{seat}</T>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Tap accessibilityRole="button" accessibilityLabel="Previous ticket" onPress={() => setI(0)} style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevronLeft" size={18} stroke={2.4} />
        </Tap>
        <T w={800} s={14}>Ticket {i + 1} of 2</T>
        <Tap accessibilityRole="button" accessibilityLabel="Next ticket" onPress={() => setI(1)} style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevronRight" size={18} stroke={2.4} />
        </Tap>
      </View>

      <View style={{ marginTop: 'auto', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="sun" size={16} color={c.muted} stroke={2.2} />
        <T s={13} color={c.muted}>Screen brightness turned up for scanning</T>
      </View>
    </View>
  );
}
