import type { Event, ImageAsset, TicketCategory } from "@/types/event";

export function mediaUrl(...images: Array<ImageAsset | undefined>) {
  for (const image of images) {
    if (image?.url) {
      return image.url;
    }
  }
  return null;
}

export function eventCoverUrl(event: Pick<Event, "cover_image" | "feature_image" | "images">) {
  return mediaUrl(event.cover_image, event.feature_image, event.images?.[0]);
}

export function parseMoney(value?: string | null) {
  if (!value) {
    return null;
  }
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function formatMoney(value?: string | null) {
  const amount = parseMoney(value);
  if (amount === null) {
    return null;
  }
  if (amount === 0) {
    return "Free";
  }
  return `LKR ${Math.round(amount).toLocaleString("en-LK")}`;
}

export function openTicketCategories(event: Pick<Event, "ticket_categories" | "is_free">) {
  return (event.ticket_categories ?? []).filter((ticket) => !ticket.is_closed);
}

export function lowestPriceLabel(event: Pick<Event, "ticket_categories" | "is_free">) {
  if (event.is_free) {
    return "Free";
  }
  const prices = openTicketCategories(event)
    .map((ticket) => parseMoney(ticket.price))
    .filter((value): value is number => value !== null);
  if (prices.length === 0) {
    return null;
  }
  const min = Math.min(...prices);
  if (min === 0) {
    return "Free";
  }
  return `From LKR ${Math.round(min).toLocaleString("en-LK")}`;
}

export function ticketAvailability(ticket: TicketCategory) {
  const total = ticket.total_quantity;
  if (total == null) {
    return null;
  }
  const taken = (ticket.sold_quantity ?? 0) + (ticket.held_quantity ?? 0);
  return Math.max(total - taken, 0);
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-LK", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-LK", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatEventWhen(start: string, end?: string | null) {
  const startDay = formatDay(start);
  const startTime = formatTime(start);
  if (!end) {
    return `${startDay} · ${startTime}`;
  }
  const sameDay = formatDay(end) === startDay;
  if (sameDay) {
    return `${startDay} · ${startTime}–${formatTime(end)}`;
  }
  return `${startDay} – ${formatDay(end)}`;
}

export function isSingleDayEvent(event: Pick<Event, "sessions">) {
  return !event.sessions || event.sessions.length === 0;
}

export function formatRegistrationWindow(open?: string | null, close?: string | null) {
  if (!open && !close) {
    return null;
  }
  if (open && close) {
    return `${formatDay(open)} – ${formatDay(close)}`;
  }
  if (open) {
    return `Opens ${formatDay(open)}`;
  }
  return `Closes ${formatDay(close!)}`;
}
