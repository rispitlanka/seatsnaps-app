import { View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { holdSummary } from '@/lib/booking';
import { useBooking } from '@/providers/booking';
import { CircleButton, PrimaryButton, TextButton } from '@/ui/components';
import { SettingsScreen } from '@/ui/settings';
import { ResultBadge } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** Shown when the 10-minute seat hold runs out. */
export default function HoldExpired() {
  const { hold, preview, clearSelection } = useBooking();
  const eventId = hold?.eventId ?? preview?.eventId ?? '';
  const summary = hold ? holdSummary(hold) : 'Your tickets';
  const toEvent = () => {
    clearSelection();
    if (eventId) {
      router.replace({ pathname: '/event/[id]', params: { id: eventId } });
      return;
    }
    router.replace('/');
  };

  return (
    <SettingsScreen background={c.white} px={24} gap={20} back={<CircleButton icon="close" label="Close" onPress={toEvent} />}>
      <View style={{ marginTop: 20 }}>
        <ResultBadge icon="timer" bg={c.timerBg} color={c.timerInk} />
      </View>
      <View accessibilityRole="alert" style={{ gap: 12 }}>
        <Display accent={c.timerInk}>Time&apos;s <Hl>up.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>We held {summary} for 10 minutes. They&apos;ve been released so others can book. You haven&apos;t been charged.</T>
      </View>

      {preview ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: c.page, borderRadius: 18 }}>
          {preview.cover ? <Image source={{ uri: preview.cover }} style={{ width: 56, height: 56, borderRadius: 12 }} /> : null}
          <View style={{ flex: 1, gap: 2 }}>
            <T w={800} s={15}>{preview.name}</T>
            <T s={12} color={c.muted}>{preview.when} · {preview.venue}</T>
          </View>
        </View>
      ) : null}

      <View style={{ marginTop: 'auto', gap: 10 }}>
        <PrimaryButton label="Pick tickets again" onPress={toEvent} />
        <TextButton label="Back to home" onPress={() => { clearSelection(); router.replace('/'); }} />
      </View>
    </SettingsScreen>
  );
}
