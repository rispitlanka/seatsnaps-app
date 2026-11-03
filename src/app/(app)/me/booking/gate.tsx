import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import QRCode from 'react-native-qrcode-svg';

import { getOrder } from '@/lib/api/bookings';
import { toErrorMessage } from '@/lib/api/errors';
import { formatEventWhen } from '@/lib/event-display';
import { CircleButton, PrimaryButton, Tap, goBack, useBottomPad, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { T } from '@/ui/Text';
import { c } from '@/ui/tokens';
import type { Order, OrderTicket } from '@/types/booking';

/** J4 Gate mode: full-screen QR for each ticket. The code is the ticket id the door scans. */
export default function GateMode() {
  const { orderId, ticketId } = useLocalSearchParams<{ orderId?: string; ticketId?: string }>();
  const top = useTopPad();
  const bottom = useBottomPad(34);
  const [order, setOrder] = useState<Order | null>(null);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!orderId) {
      setError('This ticket could not be found.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const next = await getOrder(orderId);
      const tickets = next.tickets ?? [];
      const start = Math.max(tickets.findIndex((ticket) => ticket.id === ticketId), 0);
      setOrder(next);
      setIndex(start);
      setError('');
    } catch (caught) {
      setError(toErrorMessage(caught, 'Could not load this ticket.'));
    } finally {
      setLoading(false);
    }
  }, [orderId, ticketId]);

  useEffect(() => {
    void load();
  }, [load]);

  const tickets = order?.tickets ?? [];
  const ticket: OrderTicket | undefined = tickets[index];
  const when = order?.event?.start ? formatEventWhen(order.event.start, order.event.end) : '';

  return (
    <View style={{ flex: 1, backgroundColor: c.white, alignItems: 'center', paddingTop: top, paddingHorizontal: 24, paddingBottom: bottom, gap: 18 }}>
      <StatusBar style="dark" />
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.successSoft, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="check" size={14} color={c.success} stroke={2.6} />
          <T w={800} s={12} color={c.success}>{ticket?.check_in ? 'Checked in' : 'Show at the gate'}</T>
        </View>
        <CircleButton icon="close" label="Close" onPress={() => goBack()} />
      </View>

      {loading ? <ActivityIndicator color={c.blue} /> : null}
      {error ? (
        <View style={{ gap: 12, alignItems: 'center' }}>
          <T accessibilityRole="alert" color={c.danger} align="center">{error}</T>
          <PrimaryButton label="Try again" onPress={() => void load()} />
        </View>
      ) : null}

      {ticket ? (
        <>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <T w={800} s={20} ls={-0.02} align="center">{order?.event?.name ?? 'Your ticket'}</T>
            {when ? <T s={13} color={c.muted} align="center">{when}</T> : null}
          </View>

          <View style={{ padding: 18, borderRadius: 28, borderWidth: 2, borderColor: c.ink }}>
            <QRCode value={ticket.id} size={250} />
          </View>

          <View style={{ width: '100%', flexDirection: 'row' }}>
            <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <T s={12} color={c.muted}>Ticket</T>
              <T w={800} s={16} align="center">{ticket.ticket_category?.name ?? 'Admission'}</T>
            </View>
            <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <T s={12} color={c.muted}>Seat</T>
              <T w={800} s={30} lh={0.9} color={c.blue}>{ticket.seat?.code ?? 'GA'}</T>
            </View>
          </View>

          <T w={600} s={13} ls={0.08} color={c.muted}>{ticket.reference_id}</T>

          {tickets.length > 1 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <Tap accessibilityRole="button" accessibilityLabel="Previous ticket" disabled={index === 0} onPress={() => setIndex((value) => Math.max(value - 1, 0))} style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center', opacity: index === 0 ? 0.35 : 1 }}>
                <Icon name="chevronLeft" size={18} stroke={2.4} />
              </Tap>
              <T w={800} s={14}>Ticket {index + 1} of {tickets.length}</T>
              <Tap accessibilityRole="button" accessibilityLabel="Next ticket" disabled={index === tickets.length - 1} onPress={() => setIndex((value) => Math.min(value + 1, tickets.length - 1))} style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center', opacity: index === tickets.length - 1 ? 0.35 : 1 }}>
                <Icon name="chevronRight" size={18} stroke={2.4} />
              </Tap>
            </View>
          ) : null}
        </>
      ) : null}

      {!loading && !ticket && !error ? (
        <View style={{ gap: 12, alignItems: 'center' }}>
          <T s={14} color={c.ink2} align="center">This order does not have a ticket yet.</T>
          <PrimaryButton label="Back" onPress={() => router.back()} />
        </View>
      ) : null}

      <View style={{ marginTop: 'auto', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="sun" size={16} color={c.muted} stroke={2.2} />
        <T s={13} color={c.muted}>Turn the brightness up so the code scans.</T>
      </View>
    </View>
  );
}
