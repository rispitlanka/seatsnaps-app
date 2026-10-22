import { forwardRef, type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  TextInput,
  View,
  type PressableProps,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoogleIcon, Icon, type IconName } from './Icon';
import { T } from './Text';
import { c, font } from './tokens';

/** Top padding: the boards use 52px under a 44pt status bar. */
export function useTopPad(extra = 8) {
  const { top } = useSafeAreaInsets();
  return Math.max(44 + extra, top + extra);
}

/** Bottom padding for fixed footers: the boards use 30px. */
export function useBottomPad(base = 30) {
  const { bottom } = useSafeAreaInsets();
  return Math.max(base, bottom + 12);
}

export function goBack(fallback: Parameters<typeof router.replace>[0] = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

type Press = Omit<PressableProps, 'style' | 'children'> & { style?: ViewStyle; children?: ReactNode };

/** Pressable with the subtle press feedback used across the app. */
export function Tap({ style, children, ...rest }: Press) {
  return (
    <Pressable {...rest} style={({ pressed }) => [style, pressed && { opacity: 0.72 }]}>
      {children}
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  height = 54,
  icon,
  iconRight,
  style,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  height?: number;
  icon?: IconName;
  iconRight?: IconName;
  style?: ViewStyle;
}) {
  return (
    <Tap
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        height,
        borderRadius: 999,
        backgroundColor: disabled ? c.disabled : c.blue,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={16} color={c.white} stroke={2.4} /> : null}
      <T w={700} s={16} color={c.white}>{label}</T>
      {iconRight ? <Icon name={iconRight} size={16} color={c.white} stroke={2.4} /> : null}
    </Tap>
  );
}

export function OutlineButton({
  label,
  onPress,
  height = 54,
  style,
  w = 700,
  s = 15,
}: {
  label: string;
  onPress?: () => void;
  height?: number;
  style?: ViewStyle;
  w?: 600 | 700 | 800;
  s?: number;
}) {
  return (
    <Tap
      accessibilityRole="button"
      onPress={onPress}
      style={{ height, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center', ...style }}
    >
      <T w={w} s={s}>{label}</T>
    </Tap>
  );
}

export function TextButton({ label, onPress, color = c.ink2, s = 15, height = 44, w = 700 }: { label: string; onPress?: () => void; color?: string; s?: number; height?: number; w?: 600 | 700 | 800 }) {
  return (
    <Tap accessibilityRole="button" onPress={onPress} style={{ height, alignItems: 'center', justifyContent: 'center' }}>
      <T w={w} s={s} color={color}>{label}</T>
    </Tap>
  );
}

export function GoogleButton({ height = 54, onPress }: { height?: number; onPress?: () => void }) {
  return (
    <Tap
      accessibilityRole="button"
      onPress={onPress}
      style={{ height, borderRadius: 999, borderWidth: 1, borderColor: c.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
    >
      <GoogleIcon />
      <T w={600} s={15}>Continue with Google</T>
    </Tap>
  );
}

export function OrDivider() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
      <T s={13} color={c.muted}>or</T>
      <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
    </View>
  );
}

/** Round icon button (back, share, close…). */
export function CircleButton({
  icon,
  label,
  onPress,
  variant = 'outline',
  size = 44,
  iconSize = 20,
  stroke = 2.2,
  color,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  variant?: 'outline' | 'card' | 'solid' | 'glass' | 'navy';
  size?: number;
  iconSize?: number;
  stroke?: number;
  color?: string;
}) {
  const look: Record<typeof variant, ViewStyle> = {
    outline: { borderWidth: 1, borderColor: c.line },
    card: { borderWidth: 1, borderColor: c.line, backgroundColor: c.white },
    solid: { backgroundColor: c.white },
    glass: { backgroundColor: 'rgba(255,255,255,0.14)' },
    navy: { backgroundColor: c.navy },
  };
  const ink = color ?? (variant === 'glass' || variant === 'navy' ? c.white : c.ink);
  if (variant === 'outline' || variant === 'card') size += 2;
  return (
    <Tap
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={4}
      style={{ width: size, height: size, borderRadius: 999, alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...look[variant] }}
    >
      <Icon name={icon} size={iconSize} color={ink} stroke={stroke} />
    </Tap>
  );
}

export function BackButton({ onPress, variant = 'outline' }: { onPress?: () => void; variant?: 'outline' | 'card' | 'solid' }) {
  return <CircleButton icon="chevronLeft" label="Back" variant={variant} onPress={onPress ?? (() => goBack())} />;
}

export const inputText = { fontFamily: font[400], fontSize: 15, color: c.ink, padding: 0, outlineWidth: 0 } as const;

type FieldProps = TextInputProps & {
  label?: string;
  labelSize?: number;
  height?: number;
  icon?: IconName;
  prefix?: string;
  /** "+94" style segment separated by a divider. */
  segment?: string;
  trailing?: ReactNode;
  background?: string;
  radius?: number;
  hint?: string;
  /** Error state: 2px red border on white (G3). */
  invalid?: boolean;
};

/** Labelled input matching the board fields (#F7F8FB fill, 14px radius). */
export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, labelSize = 13, height = 50, icon, prefix, segment, trailing, background = c.field, radius = 14, hint, invalid, style, ...input },
  ref,
) {
  return (
    <View style={{ gap: label ? (labelSize === 14 ? 8 : 6) : 0 }}>
      {label ? <T w={600} s={labelSize}>{label}</T> : null}
      <View
        style={{
          height,
          flexDirection: 'row',
          alignItems: 'center',
          gap: icon ? 10 : 2,
          paddingLeft: segment ? 0 : icon || labelSize === 14 ? 16 : 14,
          paddingRight: trailing ? 4 : 14,
          backgroundColor: invalid ? c.white : background,
          borderWidth: invalid ? 2 : 1,
          borderColor: invalid ? c.error : c.line,
          borderRadius: radius,
          overflow: 'hidden',
        }}
      >
        {icon ? <Icon name={icon} size={18} color={c.subtle} /> : null}
        {prefix ? <T s={15} color={c.muted}>{prefix}</T> : null}
        {segment ? (
          <View style={{ height: '100%', paddingHorizontal: 12, justifyContent: 'center', borderRightWidth: 1, borderRightColor: c.line, marginRight: 12 }}>
            <T w={600} s={15}>{segment}</T>
          </View>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor={c.subtle}
          accessibilityLabel={label ?? input.placeholder}
          {...input}
          style={[inputText, { flex: 1, height: '100%' }, style]}
        />
        {trailing}
      </View>
      {hint ? <T s={12} color={c.muted}>{hint}</T> : null}
    </View>
  );
});

export function EyeToggle({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  return (
    <Tap
      accessibilityRole="button"
      accessibilityLabel={shown ? 'Hide password' : 'Show password'}
      onPress={onToggle}
      style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
    >
      <Icon name="eye" size={19} color={c.muted} />
    </Tap>
  );
}

export function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          borderWidth: checked ? 0 : 1.5,
          borderColor: '#767676',
          backgroundColor: checked ? c.blue : c.white,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        }}
      >
        {checked ? <Icon name="check" size={14} color={c.white} stroke={3} /> : null}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </Pressable>
  );
}

/** Pill chip: dark when active, white with border otherwise. */
export function Chip({
  label,
  active,
  onPress,
  variant = 'dark',
  height = 40,
  px = 16,
  icon,
  trailing,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  variant?: 'dark' | 'soft' | 'grey';
  height?: number;
  px?: number;
  icon?: IconName;
  trailing?: IconName;
}) {
  const on: ViewStyle =
    variant === 'soft'
      ? { backgroundColor: c.blueSoft, borderWidth: 1, borderColor: c.blueSoftLine }
      : { backgroundColor: c.ink };
  const off: ViewStyle = { backgroundColor: variant === 'grey' ? c.page : c.white, borderWidth: 1, borderColor: c.line };
  const ink = active ? (variant === 'soft' ? c.blueDeep : c.white) : c.ink;
  return (
    <Tap
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      style={{ height, paddingHorizontal: px, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: trailing ? 6 : 8, flexShrink: 0, ...(active ? on : off) }}
    >
      {icon ? <Icon name={icon} size={16} color={ink} stroke={2.2} /> : null}
      <T w={active ? 700 : 600} s={14} color={ink}>{label}</T>
      {trailing ? <Icon name={trailing} size={14} color={c.ink} stroke={2.6} /> : null}
    </Tap>
  );
}

/** Horizontal rail that bleeds to the screen edges with 20px insets. */
export function Rail({ children, gap = 12, inset = 20 }: { children: ReactNode; gap?: number; inset?: number }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap, paddingHorizontal: inset }} style={{ flexGrow: 0 }}>
      {children}
    </ScrollView>
  );
}

/** "THIS WEEKEND · See all" row. */
export function SectionHeader({ children, action, onAction, size = 18 }: { children: ReactNode; action?: string; onAction?: () => void; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      {children}
      {action ? (
        <Tap onPress={onAction} accessibilityRole="link" hitSlop={10}>
          <T w={700} s={14} color={c.blue}>{action}</T>
        </Tap>
      ) : null}
    </View>
  );
}

/** Small uppercase label ("RECENT", "YOUR DETAILS"). */
export function Eyebrow({ children, color = c.muted, s = 13, ls = 0.12 }: { children: ReactNode; color?: string; s?: number; ls?: number }) {
  return <T w={800} s={s} ls={ls} color={color}>{children}</T>;
}

/** White calendar badge ("OCT / 24"). */
export function DateBadge({ mon, day, width = 52, monSize = 10, daySize = 22, radius = 14, py = 7 }: { mon: string; day: string; width?: number; monSize?: number; daySize?: number; radius?: number; py?: number }) {
  return (
    <View style={{ width, paddingVertical: py, borderRadius: radius, backgroundColor: c.white, alignItems: 'center' }}>
      <T w={800} s={monSize} color={c.blue}>{mon}</T>
      <T w={800} s={daySize} lh={1}>{day}</T>
    </View>
  );
}

export function Dots({ count, active, activeWidth = 22, color = c.blue, rest = c.dotSoft }: { count: number; active: number; activeWidth?: number; color?: string; rest?: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }} accessibilityLabel={`Step ${active + 1} of ${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ width: i === active ? activeWidth : 6, height: 6, borderRadius: 999, backgroundColor: i === active ? color : rest }} />
      ))}
    </View>
  );
}

export function Avatar({ initials, size = 52, bg = c.ink, fg = c.white, textSize, border }: { initials: string; size?: number; bg?: string; fg?: string; textSize?: number; border?: { width: number; color: string } }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        borderWidth: border?.width,
        borderColor: border?.color,
      }}
    >
      <T w={800} s={textSize ?? Math.round(size * 0.31)} color={fg}>{initials}</T>
    </View>
  );
}

/** Follow / Following pill. */
export function FollowPill({ following, onPress, height = 36, dark }: { following?: boolean; onPress?: () => void; height?: number; dark?: boolean }) {
  const style: ViewStyle = following
    ? { backgroundColor: c.white, borderWidth: 1, borderColor: c.line, paddingHorizontal: 14 }
    : { backgroundColor: dark ? c.white : c.blue, paddingHorizontal: 16 };
  return (
    <Tap accessibilityRole="button" accessibilityState={{ selected: !!following }} onPress={onPress} style={{ height, borderRadius: 999, justifyContent: 'center', flexShrink: 0, ...style }}>
      <T w={following ? 700 : 800} s={13} color={following || dark ? c.ink : c.white}>{following ? 'Following' : 'Follow'}</T>
    </Tap>
  );
}

/** White sticky footer with top border used by booking screens. */
export function Footer({ children, gap = 12 }: { children: ReactNode; gap?: number }) {
  const bottom = useBottomPad();
  return (
    <View style={{ backgroundColor: c.white, borderTopWidth: 1, borderTopColor: c.line, paddingTop: 14, paddingHorizontal: 20, paddingBottom: bottom, gap }}>
      {children}
    </View>
  );
}

/** The search-looking button on Home / Explore. */
export function SearchLink({ placeholder, onPress, style }: { placeholder: string; onPress?: () => void; style?: ViewStyle }) {
  return (
    <Tap
      accessibilityRole="search"
      onPress={onPress}
      style={{ height: 54, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 16, ...style }}
    >
      <Icon name="search" size={18} color={c.muted} />
      <T s={15} color={c.subtle}>{placeholder}</T>
    </Tap>
  );
}

/** Ticket perforation with two notches. */
export function Perforation({ notch = 22, bg, inset = 18 }: { notch?: number; bg: string; inset?: number }) {
  return (
    <View style={{ height: notch, justifyContent: 'center' }}>
      <View style={{ position: 'absolute', left: -notch / 2, width: notch, height: notch, borderRadius: 999, backgroundColor: bg }} />
      <View style={{ marginHorizontal: inset, borderTopWidth: 2, borderStyle: 'dashed', borderColor: c.dot }} />
      <View style={{ position: 'absolute', right: -notch / 2, width: notch, height: notch, borderRadius: 999, backgroundColor: bg }} />
    </View>
  );
}

/** Decorative QR pattern from the boards (not a real code). */
export function QrPattern({ n = 17, size, seed = 7, threshold = 0.5 }: { n?: number; size: number; seed?: number; threshold?: number }) {
  const rows: boolean[][] = [];
  let s = seed;
  const finder = (r: number, col: number) => {
    const corners = [[0, 0], [0, n - 7], [n - 7, 0]];
    for (const [cy, cx] of corners) {
      const y = r - cy;
      const x = col - cx;
      if (y >= 0 && y < 7 && x >= 0 && x < 7) return y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4) ? 1 : 0;
      if (y >= -1 && y <= 7 && x >= -1 && x <= 7) return 0;
    }
    return -1;
  };
  for (let r = 0; r < n; r++) {
    const row: boolean[] = [];
    for (let col = 0; col < n; col++) {
      const f = finder(r, col);
      if (f !== -1) row.push(f === 1);
      else {
        s = (s * 9301 + 49297) % 233280;
        row.push(s / 233280 > threshold);
      }
    }
    rows.push(row);
  }
  const cell = size / n;
  return (
    <View accessibilityRole="image" accessibilityLabel="QR code" style={{ width: size, height: size }}>
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {row.map((on, i) => (
            <View key={i} style={{ width: cell, height: cell, backgroundColor: on ? c.ink : 'transparent' }} />
          ))}
        </View>
      ))}
    </View>
  );
}

/** Three-step booking progress (Tickets · Seats · Checkout). */
export function BookingSteps({ step, labels = ['1 · Tickets', '2 · Seats', '3 · Checkout'] }: { step: number; labels?: string[] }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }} accessibilityLabel={`Step ${step} of ${labels.length}`}>
      {labels.map((label, i) => (
        <View key={label} style={{ flex: 1, gap: 6 }}>
          <View style={{ height: 4, borderRadius: 999, backgroundColor: i < step ? c.blue : c.line }} />
          <T w={i + 1 === step ? 800 : 700} s={11} color={i + 1 === step ? c.blue : c.muted}>{label}</T>
        </View>
      ))}
    </View>
  );
}

/** Hold countdown pill ("09:42"). */
export function TimerPill({ label }: { label: string }) {
  return (
    <View style={{ height: 32, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.timerBg, flexDirection: 'row', alignItems: 'center', gap: 6 }} accessibilityLabel={`Seats held for ${label}`}>
      <Icon name="timer" size={14} color={c.timerInk} stroke={2.4} />
      <T w={800} s={12} color={c.timerInk}>{label}</T>
    </View>
  );
}

/** Segmented control on Explore (Categories / Organisers / Venues). */
export function Segmented({ options, value, onChange, background = c.segment }: { options: string[]; value: string; onChange: (v: string) => void; background?: string }) {
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', padding: 4, backgroundColor: background, borderRadius: 999 }}>
      {options.map(option => {
        const on = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(option)}
            style={{ flex: 1, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? c.white : 'transparent', boxShadow: on ? '0 2px 6px rgba(10,17,48,0.08)' : undefined }}
          >
            <T w={on ? 800 : 700} s={14} color={on ? c.ink : c.ink2}>{option}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Underlined tabs (Upcoming / Past / About). */
export function UnderlineTabs({ options, value, onChange, gap = 24, s = 15 }: { options: string[]; value: string; onChange: (v: string) => void; gap?: number; s?: number }) {
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap }}>
      {options.map(option => {
        const on = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(option)}
            style={{ height: 44, justifyContent: 'center', borderBottomWidth: on ? 3 : 0, borderBottomColor: c.blue }}
          >
            <T w={on ? 800 : 600} s={s} color={on ? c.ink : c.muted}>{option}</T>
          </Pressable>
        );
      })}
    </View>
  );
}
