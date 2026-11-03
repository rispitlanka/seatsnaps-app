import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { BookingStatus } from '@/features/booking/BookingStatus';
import { useBookableEvent } from '@/features/booking/useBookableEvent';
import { seatedZones } from '@/lib/booking';
import { formatEventWhen } from '@/lib/event-display';
import { useBooking } from '@/providers/booking';
import { BookingHeader } from '@/ui/booking';
import { Footer, PrimaryButton } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** Pick which seated zone to open on the seat map. */
export default function ChooseSection() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { event, error, loading, reload } = useBookableEvent(id);
  const { seatIds } = useBooking();
  const [zoneId, setZoneId] = useState('');

  if (!event) {
    return <BookingStatus title="Choose a section" loading={loading} error={error} onRetry={() => void reload()} />;
  }

  const zones = seatedZones(event);
  const current = zones.find((zone) => zone.id === zoneId) ?? zones[0];

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <BookingHeader step={2} title={event.name} subtitle={formatEventWhen(event.start, event.end)} />
      <ScrollView contentContainerStyle={{ paddingVertical: 22, paddingHorizontal: 20, gap: 16 }}>
        <View style={{ gap: 8 }}>
          <Display>Choose a <Hl>section.</Hl></Display>
          <T s={14} lh={1.5} color={c.ink2}>Seats are priced by the ticket assigned to each one.</T>
        </View>

        {zones.map((zone) => {
          const on = zone.id === current?.id;
          const available = (zone.seats ?? []).filter((seat) => seat.status === 'AVAILABLE').length;
          const mine = (zone.seats ?? []).filter((seat) => seatIds.includes(seat.id)).length;
          return (
            <Pressable
              key={zone.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => setZoneId(zone.id)}
              style={{
                padding: 16,
                borderRadius: 18,
                backgroundColor: on ? c.blue : c.white,
                borderWidth: on ? 0 : 1,
                borderColor: c.line,
                gap: 4,
              }}
            >
              <T w={800} s={16} color={on ? c.white : c.ink}>{zone.name}</T>
              <T s={13} color={on ? c.white : c.ink2}>
                {available} available{mine ? ` · ${mine} selected` : ''}
              </T>
            </Pressable>
          );
        })}
      </ScrollView>
      <Footer>
        <PrimaryButton
          label="Pick seats"
          disabled={!current}
          onPress={() => current && router.push({ pathname: '/event/[id]/seats', params: { id: event.id, zone: current.id } })}
        />
      </Footer>
    </View>
  );
}
