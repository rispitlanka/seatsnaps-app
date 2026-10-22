import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { quickDates } from '@/mocks/support';
import { Footer, PrimaryButton, Tap } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { BottomSheet } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const TODAY = 14;
const OFFSET = 4; // 1 October 2026 is a Thursday.
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/** H4 Date picker sheet (October 2026 sample month). */
export default function DatePicker() {
  const [range, setRange] = useState<{ a: number | null; b: number | null }>({ a: 17, b: 18 });
  const lo = range.a;
  const hi = range.b ?? range.a;

  const pick = (d: number) => {
    if (!range.a || range.b) setRange({ a: d, b: null });
    else if (d < range.a) setRange({ a: d, b: range.a });
    else setRange({ a: range.a, b: d });
  };

  const cta = !lo ? 'Show all dates' : lo === hi ? `Show events · ${lo} Oct` : `Show events · ${lo}–${hi} Oct`;
  const cells: (number | null)[] = [...Array(OFFSET).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)];

  return (
    <BottomSheet offset={150} label="Pick dates">
      <View style={{ paddingTop: 14, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Display size={24}>Pick <Hl>dates</Hl></Display>
        <Tap accessibilityRole="button" onPress={() => setRange({ a: null, b: null })} style={{ minHeight: 44, justifyContent: 'center' }}>
          <T w={700} s={14} color={c.blue}>Clear</T>
        </Tap>
      </View>

      <View style={{ flex: 1, paddingTop: 10, paddingHorizontal: 20, gap: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {quickDates.map(([label, a, b]) => {
            const on = lo === a && hi === b;
            return (
              <Tap key={label} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => setRange({ a, b })} style={{ height: 38, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center', backgroundColor: on ? c.ink : c.white, borderWidth: on ? 0 : 1, borderColor: c.line }}>
                <T w={on ? 700 : 600} s={13} color={on ? c.white : c.ink}>{label}</T>
              </Tap>
            );
          })}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View accessibilityRole="button" accessibilityLabel="Previous month" accessibilityState={{ disabled: true }} style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="chevronLeft" size={18} color={c.disabled} stroke={2.4} />
          </View>
          <T w={800} s={16}>October 2026</T>
          <Tap accessibilityRole="button" accessibilityLabel="Next month" style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="chevronRight" size={18} stroke={2.4} />
          </Tap>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 4 }}>
          {DOW.map(d => (
            <View key={d} style={{ width: `${100 / 7}%`, height: 28, alignItems: 'center', justifyContent: 'center' }}>
              <T w={700} s={12} color={c.muted}>{d}</T>
            </View>
          ))}
          {cells.map((d, i) => {
            if (!d) return <View key={`blank-${i}`} style={{ width: `${100 / 7}%`, height: 44 }} />;
            const past = d < TODAY;
            const inRange = !!lo && !!hi && d >= lo && d <= hi;
            const end = d === lo || d === hi;
            const band = inRange && lo !== hi;
            return (
              <View
                key={d}
                style={{
                  width: `${100 / 7}%`,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: band ? c.blueSoft : 'transparent',
                  borderTopLeftRadius: band && d === lo ? 999 : 0,
                  borderBottomLeftRadius: band && d === lo ? 999 : 0,
                  borderTopRightRadius: band && d === hi ? 999 : 0,
                  borderBottomRightRadius: band && d === hi ? 999 : 0,
                }}
              >
                <Pressable
                  disabled={past}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: past, selected: inRange }}
                  accessibilityLabel={`${d} October${d === TODAY ? ', today' : ''}`}
                  onPress={() => pick(d)}
                  style={{ width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: end && !past ? c.blue : 'transparent', borderWidth: d === TODAY && !inRange ? 1.5 : 0, borderColor: c.ink }}
                >
                  <T w={end ? 800 : inRange ? 700 : 600} s={15} color={past ? c.disabled : end ? c.white : inRange ? c.blueDeep : c.ink}>{d}</T>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>

      <Footer>
        <PrimaryButton label={cta} onPress={() => router.back()} />
      </Footer>
    </BottomSheet>
  );
}
