import { listOrders, listTickets } from '@/lib/api/bookings';
import { getEventById } from '@/lib/api/events';
import { eventCoverUrl } from '@/lib/event-display';
import type { Order } from '@/types/booking';
import type { Event } from '@/types/event';

export type TicketOrder = {
  order: Order;
  cover: string | null;
  venueName: string | null;
  venueId: string | null;
};

export async function loadTicketOrders(): Promise<TicketOrder[]> {
  const [orders, tickets] = await Promise.all([listOrders(), listTickets()]);
  const coverFromTickets = new Map<string, string>();
  for (const ticket of tickets) {
    const eventId = ticket.event_id ?? ticket.event?.id;
    const cover = ticket.event ? eventCoverUrl(ticket.event) : null;
    if (eventId && cover) {
      coverFromTickets.set(eventId, cover);
    }
  }

  const missingIds = [...new Set(orders.filter((order) => !orderCover(order, coverFromTickets) || !order.event?.venue?.name).map((order) => order.event_id))];
  const events = new Map<string, Event>();
  await Promise.all(
    missingIds.map(async (id) => {
      try {
        events.set(id, await getEventById(id));
      } catch {
        // A past or unpublished event can be absent from the public catalog.
      }
    }),
  );

  return orders.map((order) => {
    const event = events.get(order.event_id);
    const venue = order.event?.venue ?? event?.venue ?? null;
    return {
      order,
      cover: orderCover(order, coverFromTickets) ?? (event ? eventCoverUrl(event) : null),
      venueName: venue?.name ?? null,
      venueId: venue?.id ?? null,
    };
  });
}

function orderCover(order: Order, covers: Map<string, string>) {
  return (order.event ? eventCoverUrl(order.event) : null) ?? covers.get(order.event_id) ?? null;
}
