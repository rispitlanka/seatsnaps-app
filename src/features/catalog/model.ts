import type { Event, EventVenue } from '@/types/event';
import { eventCoverUrl, lowestPriceLabel } from '@/lib/event-display';

export function venueAddress(venue?: EventVenue | null) {
  return [venue?.address || venue?.location, venue?.venue_city?.name || venue?.city]
    .filter(Boolean).join(' · ');
}

/** The public API has no keyword parameter; match its complete result locally. */
export function matchEvents(events: Event[], query: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return events.filter(event => {
    const text = [event.name, event.description, event.category?.name,
      event.organization?.name, event.venue?.name, venueAddress(event.venue),
      ...(event.tags ?? []).map(tag => tag.name), event.is_free || lowestPriceLabel(event) === 'Free' ? 'free' : '']
      .filter(Boolean).join(' ').toLocaleLowerCase();
    return words.every(word => text.includes(word));
  });
}

export function matchVenues(venues: EventVenue[], query: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return venues.filter(venue => {
    const text = `${venue.name} ${venueAddress(venue)}`.toLocaleLowerCase();
    return words.every(word => text.includes(word));
  });
}

export function dateLabel(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Date to be announced';
  return date.toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function publicEvents(events: Event[]) {
  return events.filter(event => event.status === 'PUBLISHED' || event.status === 'ACTIVE')
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

export function plainDescription(value?: string | null) {
  return (value ?? '').replace(/<br\s*\/?>|<\/p>/gi, '\n').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

export function homeCard(event: Event) {
  const date = new Date(event.start);
  const url = eventCoverUrl(event);
  return {
    id: event.id, name: event.name, img: url ? { uri: url } : null,
    mon: Number.isFinite(date.getTime()) ? date.toLocaleDateString('en-LK', { month: 'short' }).toUpperCase() : 'TBA',
    day: Number.isFinite(date.getTime()) ? String(date.getDate()) : '–',
    date: dateLabel(event.start), cat: event.category?.name ?? 'Event',
    meta: [event.venue?.name, venueAddress(event.venue)].filter(Boolean).join(' · '),
    price: lowestPriceLabel(event) ?? 'Pricing TBA', dist: '',
  };
}

export function eventsInPeriod(events: Event[], period: string, now = new Date()) {
  if (period === 'Any time') return events;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (period === 'This weekend') {
    const day = start.getDay();
    start.setDate(start.getDate() + (day === 0 ? -1 : (6 - day)));
  }
  const end = new Date(start);
  end.setDate(end.getDate() + (period === 'This weekend' ? 2 : 1));
  return events.filter(event => Date.parse(event.start) < end.getTime() && Date.parse(event.end || event.start) >= start.getTime());
}
