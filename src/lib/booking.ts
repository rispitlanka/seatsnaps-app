import type { Hold } from "@/types/booking";
import type { Event, EventSeat, EventZone, TicketCategory } from "@/types/event";
import { parseMoney, ticketAvailability } from "./event-display";

export function isSeatedZone(zone: EventZone) {
  return zone.type === "SEATED" || zone.is_seated === true;
}

export function isCanvasZone(zone: EventZone) {
  return zone.seat_type === "CANVAS";
}

export function isTicketOpen(ticket: TicketCategory) {
  if (ticket.is_closed) {
    return false;
  }
  if (ticket.close_date && new Date(ticket.close_date).getTime() < Date.now()) {
    return false;
  }
  return true;
}

export function standingRemaining(ticket: TicketCategory) {
  if (!isTicketOpen(ticket)) {
    return 0;
  }
  const remaining = ticketAvailability(ticket);
  return remaining === null ? Number.POSITIVE_INFINITY : remaining;
}

export function ticketsForZone(event: Event, zone: EventZone) {
  return (event.ticket_categories ?? []).filter(
    (ticket) => ticket.zone_id === zone.id && isTicketOpen(ticket),
  );
}

export function groupSeatsByRow(seats: EventSeat[]) {
  const rows = new Map<string, EventSeat[]>();
  for (const seat of seats) {
    const key = seat.row || "Row";
    const list = rows.get(key) ?? [];
    list.push(seat);
    rows.set(key, list);
  }
  for (const list of rows.values()) {
    list.sort((a, b) => (a.column ?? 0) - (b.column ?? 0));
  }
  return [...rows.entries()].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));
}

export function fieldOptions(options?: unknown[]): string[] {
  if (!options) {
    return [];
  }
  return options
    .map((option) => {
      if (typeof option === "string") {
        return option;
      }
      if (option && typeof option === "object" && "value" in option) {
        return String((option as { value: unknown }).value);
      }
      if (option && typeof option === "object" && "name" in option) {
        return String((option as { name: unknown }).name);
      }
      return String(option);
    })
    .filter(Boolean);
}

export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function cartCount(seatIds: string[], standing: Record<string, number>) {
  return seatIds.length + Object.values(standing).reduce((sum, qty) => sum + qty, 0);
}

export function moneyAmount(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    return parseMoney(value) ?? 0;
  }
  if (value && typeof value === "object") {
    return parseMoney(String(value)) ?? 0;
  }
  return 0;
}

export function registrationOpen(event: Event) {
  if (event.status !== "PUBLISHED" && event.status !== "ACTIVE") {
    return false;
  }
  const now = Date.now();
  if (event.registration_open && Date.parse(event.registration_open) > now) {
    return false;
  }
  if (event.registration_close && Date.parse(event.registration_close) < now) {
    return false;
  }
  return true;
}

export function seatedZones(event: Event) {
  return (event.zones ?? []).filter((zone) => isSeatedZone(zone) && (zone.seats?.length ?? 0) > 0);
}

/** Seated ticket categories. The buyer chooses a count, then picks that many seats. */
export function seatedTickets(event: Event) {
  const zoneIds = new Set(seatedZones(event).map((zone) => zone.id));
  return (event.ticket_categories ?? []).filter(
    (ticket) => isTicketOpen(ticket) && !!ticket.zone_id && zoneIds.has(ticket.zone_id),
  );
}

export function availableSeatsForCategory(event: Event, categoryId: string) {
  return seatedZones(event)
    .flatMap((zone) => zone.seats ?? [])
    .filter((seat) => seat.ticket_category_id === categoryId && seat.status === "AVAILABLE").length;
}

export function pickedSeatsForCategory(event: Event, seatIds: string[], categoryId: string) {
  const selected = new Set(seatIds);
  return seatedZones(event)
    .flatMap((zone) => zone.seats ?? [])
    .filter((seat) => selected.has(seat.id) && seat.ticket_category_id === categoryId);
}

/** True when every seated quantity has exactly that many chosen seats. */
export function seatTargetsMet(event: Event, seatIds: string[], seatQty: Record<string, number>) {
  const seats = seatedZones(event).flatMap((zone) => zone.seats ?? []);
  const selected = new Set(seatIds);
  for (const ticket of seatedTickets(event)) {
    const want = seatQty[ticket.id] ?? 0;
    const have = seats.filter((seat) => selected.has(seat.id) && seat.ticket_category_id === ticket.id).length;
    if (have !== want) {
      return false;
    }
  }
  const wanted = new Set(seatedTickets(event).filter((ticket) => (seatQty[ticket.id] ?? 0) > 0).map((ticket) => ticket.id));
  return seats.every((seat) => !selected.has(seat.id) || (seat.ticket_category_id != null && wanted.has(seat.ticket_category_id)));
}

/** Ticket categories sold by quantity, not by picking a seat. */
export function standingTickets(event: Event) {
  const seatedIds = new Set((event.zones ?? []).filter((zone) => isSeatedZone(zone)).map((zone) => zone.id));
  return (event.ticket_categories ?? []).filter((ticket) => {
    if (!isTicketOpen(ticket)) {
      return false;
    }
    return !ticket.zone_id || !seatedIds.has(ticket.zone_id);
  });
}

export function ticketLimit(event: Event) {
  return event.ticket_limit && event.ticket_limit > 0 ? event.ticket_limit : 10;
}

export type BookingDestination = {
  pathname: "/event/[id]/select" | "/event/[id]/section" | "/event/[id]/seats" | "/event/[id]/admission";
  params: { id: string; zone?: string };
};

export function bookingDestination(event: Event): BookingDestination | null {
  if (!registrationOpen(event)) {
    return null;
  }
  const seated = seatedZones(event);
  const standing = standingTickets(event);
  const id = event.id;
  if (seated.length > 0 || standing.length > 0) {
    return { pathname: "/event/[id]/select", params: { id } };
  }
  return null;
}

function categoryCharge(price: unknown, discount: unknown) {
  const list = moneyAmount(price);
  const off = Math.min(Math.max(moneyAmount(discount), 0), list);
  return { list, off, unit: list - off };
}

export type PriceQuote = {
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  summary: string;
};

/** Price the quantities chosen on the tickets step, before or after seats are picked. */
export function quoteTicketCounts(event: Event, seatQty: Record<string, number>, standing: Record<string, number>): PriceQuote {
  let subtotal = 0;
  let discount = 0;
  let count = 0;
  const parts: string[] = [];

  const lines = [
    ...seatedTickets(event).map((ticket) => ({ ticket, qty: seatQty[ticket.id] ?? 0 })),
    ...standingTickets(event).map((ticket) => ({ ticket, qty: standing[ticket.id] ?? 0 })),
  ];
  for (const { ticket, qty } of lines) {
    if (qty <= 0) {
      continue;
    }
    const charge = categoryCharge(ticket.price, ticket.discount);
    subtotal += charge.list * qty;
    discount += charge.off * qty;
    count += qty;
    parts.push(`${qty} × ${ticket.name}`);
  }

  return {
    count,
    subtotal,
    discount,
    total: Math.max(subtotal - discount, 0),
    summary: parts.join(", "),
  };
}

export function quoteSelection(event: Event, seatIds: string[], standing: Record<string, number>): PriceQuote {
  let subtotal = 0;
  let discount = 0;
  let count = 0;
  const parts: string[] = [];
  const seats = seatedZones(event).flatMap((zone) => zone.seats ?? []);
  const categories = event.ticket_categories ?? [];
  const seatGroups = new Map<string, number>();

  for (const seatId of seatIds) {
    const seat = seats.find((item) => item.id === seatId);
    const category = categories.find((item) => item.id === seat?.ticket_category_id);
    const charge = categoryCharge(category?.price, category?.discount);
    subtotal += charge.list;
    discount += charge.off;
    count += 1;
    const name = category?.name ?? "Seat";
    seatGroups.set(name, (seatGroups.get(name) ?? 0) + 1);
  }
  for (const [name, qty] of seatGroups) {
    parts.push(`${qty} × ${name}`);
  }

  for (const ticket of standingTickets(event)) {
    const qty = standing[ticket.id] ?? 0;
    if (qty <= 0) {
      continue;
    }
    const charge = categoryCharge(ticket.price, ticket.discount);
    subtotal += charge.list * qty;
    discount += charge.off * qty;
    count += qty;
    parts.push(`${qty} × ${ticket.name}`);
  }

  return {
    count,
    subtotal,
    discount,
    total: Math.max(subtotal - discount, 0),
    summary: parts.join(", "),
  };
}

export function quoteHold(hold: Hold, event?: Event | null): PriceQuote {
  const summary = holdSummary(hold, event);
  if (hold.pricing) {
    const subtotal = moneyAmount(hold.pricing.subtotal);
    const discount = moneyAmount(hold.pricing.discount_total);
    const total = moneyAmount(hold.pricing.total);
    return {
      count: hold.pricing.ticketCount ?? cartCount(hold.seats?.map((seat) => seat.id) ?? [], standingMap(hold)),
      subtotal,
      discount,
      total: total || Math.max(subtotal - discount, 0),
      summary,
    };
  }

  let subtotal = 0;
  let discount = 0;
  let count = 0;
  const categories = event?.ticket_categories ?? [];
  for (const seat of hold.seats ?? []) {
    const category =
      seat.ticket_category ??
      categories.find((item) => item.id === seat.ticket_category_id);
    const charge = categoryCharge(category?.price, category?.discount);
    subtotal += charge.list;
    discount += charge.off;
    count += 1;
  }
  for (const item of hold.standing ?? []) {
    const category = item.ticketCategory ?? categories.find((entry) => entry.id === item.ticketCategoryId);
    const charge = categoryCharge(category?.price, category?.discount);
    subtotal += charge.list * item.quantity;
    discount += charge.off * item.quantity;
    count += item.quantity;
  }
  return { count, subtotal, discount, total: Math.max(subtotal - discount, 0), summary };
}

function standingMap(hold: Hold) {
  return Object.fromEntries((hold.standing ?? []).map((item) => [item.ticketCategoryId, item.quantity]));
}

export function holdSummary(hold: Hold, event?: Event | null) {
  const categories = event?.ticket_categories ?? [];
  const parts: string[] = [];
  const seatGroups = new Map<string, string[]>();
  for (const seat of hold.seats ?? []) {
    const category = categories.find((item) => item.id === (seat.ticket_category_id ?? seat.ticket_category?.id));
    const name = seat.ticket_category?.name ?? category?.name ?? "Seat";
    const codes = seatGroups.get(name) ?? [];
    if (seat.code) {
      codes.push(seat.code);
    }
    seatGroups.set(name, codes);
  }
  for (const [name, codes] of seatGroups) {
    parts.push(codes.length ? `${codes.length} × ${name} · ${codes.join(", ")}` : `${name}`);
  }
  for (const item of hold.standing ?? []) {
    const category = categories.find((entry) => entry.id === item.ticketCategoryId);
    parts.push(`${item.quantity} × ${item.ticketCategory?.name ?? category?.name ?? "General admission"}`);
  }
  return parts.join(", ");
}

export function selectionFromHold(hold: Hold) {
  return {
    seatIds: (hold.seats ?? []).map((seat) => seat.id),
    standing: standingMap(hold),
  };
}
