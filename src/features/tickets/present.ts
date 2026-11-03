import { eventCoverUrl, formatEventWhen, formatMoney, parseMoney } from '@/lib/event-display';
import type { Order, OrderStatus } from '@/types/booking';

export function isUpcomingOrder(order: Order, now = Date.now()) {
  if (order.status !== 'PAID' && order.status !== 'PENDING_PAYMENT') {
    return false;
  }
  const end = order.event?.end ?? order.event?.start;
  if (!end) {
    return true;
  }
  return new Date(end).getTime() >= now;
}

export function orderStatusLabel(status: OrderStatus) {
  switch (status) {
    case 'PAID':
      return { label: 'Confirmed', tone: 'success' as const };
    case 'PENDING_PAYMENT':
      return { label: 'Payment pending', tone: 'pending' as const };
    case 'FAILED':
      return { label: 'Payment failed', tone: 'danger' as const };
    case 'EXPIRED':
      return { label: 'Expired', tone: 'danger' as const };
    case 'CANCELLED':
      return { label: 'Cancelled', tone: 'danger' as const };
    default:
      return { label: status, tone: 'pending' as const };
  }
}

export function daysUntilLabel(start?: string | null, now = new Date()) {
  if (!start) {
    return null;
  }
  const when = new Date(start);
  const startDay = new Date(when.getFullYear(), when.getMonth(), when.getDate()).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diff = Math.round((startDay - today) / 86_400_000);
  if (diff < 0) {
    return null;
  }
  if (diff === 0) {
    return 'Today';
  }
  if (diff === 1) {
    return 'Tomorrow';
  }
  return `In ${diff} days`;
}

export function orderWhen(order: Order, venueName?: string | null) {
  const when = order.event?.start ? formatEventWhen(order.event.start, order.event.end) : 'Date to be announced';
  return venueName ? `${when} · ${venueName}` : when;
}

export function categoryPills(order: Order) {
  const counts = new Map<string, number>();
  const rows = order.tickets?.length ? order.tickets : order.items ?? [];
  for (const row of rows) {
    const name = row.ticket_category?.name ?? 'Ticket';
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts].map(([name, qty]) => `${qty} × ${name}`);
}

export function seatCodes(order: Order) {
  const rows = order.tickets?.length ? order.tickets : order.items ?? [];
  return rows.map((row) => row.seat?.code).filter((code): code is string => Boolean(code));
}

export function seatPill(order: Order) {
  const codes = seatCodes(order);
  if (codes.length === 0) {
    return 'No seat';
  }
  return codes.length === 1 ? `Seat ${codes[0]}` : `Seats ${codes.join(', ')}`;
}

export function pricePill(order: Order) {
  if (order.event?.is_free) {
    return 'Free';
  }
  return formatMoney(order.total) ?? 'Free';
}

export function paymentLines(order: Order) {
  const groups = new Map<string, { qty: number; amount: number }>();
  for (const item of order.items ?? []) {
    const name = item.ticket_category?.name ?? 'Ticket';
    const current = groups.get(name) ?? { qty: 0, amount: 0 };
    current.qty += 1;
    current.amount += parseMoney(item.unit_price) ?? 0;
    groups.set(name, current);
  }
  return [...groups].map(([name, group]) => ({
    label: `${group.qty} × ${name}`,
    value: formatMoney(String(group.amount)) ?? 'Free',
  }));
}

export function bookedLabel(iso?: string | null) {
  if (!iso) {
    return null;
  }
  return new Date(iso).toLocaleString('en-LK', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function orderCover(order: Order) {
  return order.event ? eventCoverUrl(order.event) : null;
}
