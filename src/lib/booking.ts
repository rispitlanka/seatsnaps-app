import type { Event, EventSeat, EventZone, TicketCategory } from "@/types/event";
import { ticketAvailability } from "./event-display";

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
  return ticketAvailability(ticket) ?? 0;
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
