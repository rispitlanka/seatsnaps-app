import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View, type ViewStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { BackButton, Tap, useBottomPad, useTopPad } from './components';
import { Icon, type IconName } from './Icon';
import { T } from './Text';
import { c } from './tokens';

/** Grey settings page with a back button (E3–E8, G4): 52/20/30 padding, 18 gap. */
export function SettingsScreen({
  children,
  gap = 18,
  background = c.page,
  px = 20,
  back,
  onBack,
}: {
  children: ReactNode;
  gap?: number;
  background?: string;
  px?: number;
  /** Replaces the default back button (e.g. a close button). */
  back?: ReactNode;
  onBack?: () => void;
}) {
  const top = useTopPad();
  const bottom = useBottomPad();
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: background }}>
      <StatusBar style="dark" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingTop: top, paddingHorizontal: px, paddingBottom: bottom, gap }}>
        <View style={{ flexDirection: 'row' }}>{back ?? <BackButton variant={background === c.white ? 'outline' : 'card'} onPress={onBack} />}</View>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** White rounded card holding divided rows. */
export function ListCard({ children, px = 14, radius = 20, style }: { children: ReactNode; px?: number; radius?: number; style?: ViewStyle }) {
  return <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: radius, paddingVertical: 4, paddingHorizontal: px, ...style }}>{children}</View>;
}

/** Row inside a ListCard with optional icon tile and trailing element. */
export function ListRow({
  title,
  sub,
  subColor = c.muted,
  subBold,
  icon,
  tint = 'blue',
  trailing,
  last,
  onPress,
  py = 12,
  px = 0,
  gap = 2,
}: {
  title: string;
  sub?: string;
  subColor?: string;
  subBold?: boolean;
  icon?: IconName;
  tint?: 'blue' | 'grey';
  trailing?: ReactNode;
  last?: boolean;
  onPress?: () => void;
  py?: number;
  px?: number;
  gap?: number;
}) {
  const body = (
    <>
      {icon ? (
        <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: tint === 'blue' ? c.blueSoft : c.page }}>
          <Icon name={icon} size={20} color={tint === 'blue' ? c.blue : c.ink} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap }}>
        <T w={700} s={15}>{title}</T>
        {sub ? <T w={subBold ? 700 : 400} s={12} color={subColor}>{sub}</T> : null}
      </View>
      {trailing}
    </>
  );
  const style: ViewStyle = { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: py, paddingHorizontal: px, borderBottomWidth: last ? 0 : 1, borderBottomColor: c.lineSoft };
  return onPress ? (
    <Tap accessibilityRole="button" accessibilityLabel={sub ? `${title}, ${sub}` : title} onPress={onPress} style={style}>{body}</Tap>
  ) : (
    <View style={style}>{body}</View>
  );
}

export function Chevron() {
  return <Icon name="chevronRight" size={18} color={c.subtle} stroke={2.2} />;
}

/** 50×30 switch from the boards. */
export function Toggle({ value, onChange, label, locked }: { value: boolean; onChange?: (v: boolean) => void; label: string; locked?: boolean }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled: locked }}
      disabled={locked}
      onPress={() => onChange?.(!value)}
      style={{ width: 50, height: 30, borderRadius: 999, padding: 3, flexDirection: 'row', justifyContent: value ? 'flex-end' : 'flex-start', backgroundColor: value ? (locked ? c.periwinkle : c.blue) : c.dot }}
    >
      <View style={{ width: 24, height: 24, borderRadius: 999, backgroundColor: c.white, boxShadow: '0 1px 3px rgba(10,17,48,0.25)' }} />
    </Pressable>
  );
}

/** 22pt radio dot (G6). */
export function RadioDot({ on }: { on: boolean }) {
  return <View style={{ width: 22, height: 22, borderRadius: 999, borderWidth: on ? 7 : 2, borderColor: on ? c.blue : c.disabled }} />;
}

/** Small text action inside a row ("Remove", "Link", "Sign out"). */
export function RowAction({ label, color = c.ink2, w = 700, onPress }: { label: string; color?: string; w?: 700 | 800; onPress?: () => void }) {
  return (
    <Tap accessibilityRole="button" onPress={onPress} style={{ minHeight: 44, justifyContent: 'center' }}>
      <T w={w} s={13} color={color}>{label}</T>
    </Tap>
  );
}

/** Six code boxes; the next empty box is highlighted. */
export function CodeBoxes({ code }: { code: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }} accessibilityLabel={`Verification code, ${code.length} of 6 digits entered`}>
      {Array.from({ length: 6 }, (_, i) => {
        const filled = i < code.length;
        const active = i === code.length;
        return (
          <View key={i} style={{ flex: 1, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: filled ? c.white : c.field, borderWidth: active ? 2 : 1, borderColor: active ? c.blue : c.line }}>
            <T w={800} s={22}>{filled ? code[i] : ''}</T>
          </View>
        );
      })}
    </View>
  );
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

/** On-screen number pad used for the verification code. */
export function Keypad({ onKey }: { onKey: (key: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {KEYS.map((key, i) =>
        key ? (
          <Tap key={i} accessibilityRole="keyboardkey" accessibilityLabel={key === '⌫' ? 'Delete' : key} onPress={() => onKey(key)} style={{ flexBasis: '30%', flexGrow: 1, height: 48, borderRadius: 14, backgroundColor: c.page, alignItems: 'center', justifyContent: 'center' }}>
            <T w={700} s={20}>{key}</T>
          </Tap>
        ) : (
          <View key={i} style={{ flexBasis: '30%', flexGrow: 1, height: 48 }} />
        ),
      )}
    </View>
  );
}

/** Blue rounded icon tile at the top of the password screens (G1, G2). */
export function IconTile({ icon }: { icon: IconName }) {
  return (
    <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={30} color={c.blue} />
    </View>
  );
}
