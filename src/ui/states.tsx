import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { StatusBar } from 'expo-status-bar';

import { BackButton, Tap, goBack, useTopPad } from './components';
import { Icon, type IconName } from './Icon';
import { T } from './Text';
import { c } from './tokens';

/** Large round status icon (I4, I5, J2, J3…). */
export function ResultBadge({ icon, bg, color, size = 76, iconSize = 34, stroke = 2.4 }: { icon: IconName; bg: string; color: string; size?: number; iconSize?: number; stroke?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: 999, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={iconSize} color={color} stroke={stroke} />
    </View>
  );
}

/** Dimmed backdrop with a white sheet; tapping above the sheet closes it (C8, H4, I9, J10). */
export function BottomSheet({
  offset,
  children,
  onClose = () => goBack(),
  backdrop = 'rgba(10,17,48,0.72)',
  under,
  label,
}: {
  /** Distance from the top of the screen to the sheet on a 390×844 board. */
  offset: number;
  children: ReactNode;
  onClose?: () => void;
  backdrop?: string;
  under?: ReactNode;
  label: string;
}) {
  const top = useTopPad(offset - 44);
  return (
    <View style={{ flex: 1, backgroundColor: backdrop }}>
      <StatusBar style="light" />
      {under}
      <Pressable accessibilityLabel={`Close ${label}`} onPress={onClose} style={{ height: top }} />
      <View accessibilityViewIsModal accessibilityLabel={label} style={{ flex: 1, backgroundColor: c.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
        <View style={{ alignItems: 'center', paddingTop: 10 }}>
          <View style={{ width: 40, height: 5, borderRadius: 999, backgroundColor: c.dot }} />
        </View>
        {children}
      </View>
    </View>
  );
}

/** Photo header with back button and a status pill (I6, I7, I8). */
export function StatusHero({ source, height, pill, dim, gray, alt }: { source: ImageSource; height: number; pill?: ReactNode; dim?: number; gray?: number; alt?: string }) {
  const top = useTopPad();
  return (
    <View style={{ height: height - 52 + top, backgroundColor: c.ink }}>
      <StatusBar style="light" />
      {/* Grayscale renders on web and Android; iOS shows the dimmed photo. */}
      <View style={{ flex: 1, opacity: dim ?? 1, filter: gray ? `grayscale(${gray})` : undefined }}>
        <Image source={source} accessibilityLabel={alt} style={{ width: '100%', height: '100%' }} />
      </View>
      <View style={{ position: 'absolute', top, left: 20 }}>
        <BackButton variant="solid" />
      </View>
      {pill ? <View style={{ position: 'absolute', left: 20, bottom: 44 }}>{pill}</View> : null}
    </View>
  );
}

/** White rounded body that overlaps a hero by 28pt. */
export function SheetBody({ children, gap = 16, pb = 24 }: { children: ReactNode; gap?: number; pb?: number }) {
  return (
    <View style={{ flex: 1, marginTop: -28, backgroundColor: c.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 24, paddingHorizontal: 20, paddingBottom: pb, gap }}>
      {children}
    </View>
  );
}

/** − qty + control (D2, I1, I2). */
export function QtyStepper({ qty, onMinus, onPlus, label, min = 0 }: { qty: number; onMinus: () => void; onPlus: () => void; label: string; min?: number }) {
  const canMinus = qty > min;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Tap accessibilityRole="button" accessibilityLabel={`Remove one ${label}`} disabled={!canMinus} onPress={onMinus} style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="minus" size={16} color={canMinus ? c.ink : c.disabled} stroke={2.6} />
      </Tap>
      <T w={800} s={16} align="center" style={{ width: 26 }} accessibilityLiveRegion="polite">{qty}</T>
      <Tap accessibilityRole="button" accessibilityLabel={`Add one ${label}`} onPress={onPlus} style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="plus" size={16} color={c.white} stroke={2.6} />
      </Tap>
    </View>
  );
}

/** Progress step: done (green tick), current (blue ring) or upcoming (grey ring). */
export function StepDot({ state, size = 16 }: { state: 'done' | 'current' | 'todo'; size?: number }) {
  if (state === 'done') {
    return (
      <View style={{ width: size, height: size, borderRadius: 999, backgroundColor: size > 16 ? c.success : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="check" size={size > 16 ? 12 : 16} color={size > 16 ? c.white : c.success} stroke={size > 16 ? 3.4 : 3} />
      </View>
    );
  }
  return <View style={{ width: size, height: size, borderRadius: 999, borderWidth: state === 'current' ? 3 : 2, borderColor: state === 'current' ? c.blue : c.dotSoft }} />;
}

/** Info / warning / success callout row. */
export function Callout({ icon, tone, children, iconSize = 20 }: { icon: IconName; tone: 'info' | 'warn' | 'success' | 'error' | 'neutral'; children: ReactNode; iconSize?: number }) {
  const tones = {
    info: [c.blueSoft, c.blueDeep],
    warn: [c.timerBg, c.timerInk],
    success: [c.successSoft, c.success],
    error: [c.errorSoft, c.error],
    neutral: [c.page, c.ink],
  } as const;
  const [bg, ink] = tones[tone];
  return (
    <View style={{ flexDirection: 'row', gap: 12, padding: 14, backgroundColor: bg, borderRadius: 16 }}>
      <View style={{ marginTop: 1 }}>
        <Icon name={icon} size={iconSize} color={ink} stroke={2.2} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>{children}</View>
    </View>
  );
}

/** Centred empty state with artwork, copy and one action (L7, L8, L9). */
export function EmptyState({ art, title, body, action, onAction, outline }: { art: ReactNode; title: string; body: string; action: string; onAction: () => void; outline?: boolean }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 12 }}>
      {art}
      <T w={800} s={18} align="center">{title}</T>
      <T s={14} lh={1.5} color={c.ink2} align="center">{body}</T>
      <Tap
        accessibilityRole="button"
        onPress={onAction}
        style={{ marginTop: 6, height: outline ? 50 : 48, paddingHorizontal: 22, borderRadius: 999, justifyContent: 'center', backgroundColor: outline ? c.white : c.blue, borderWidth: outline ? 1 : 0, borderColor: c.line }}
      >
        <T w={700} s={15} color={outline ? c.ink : c.white}>{action}</T>
      </Tap>
    </View>
  );
}
