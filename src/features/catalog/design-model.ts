import type { Event, EventCategory, EventVenue, OrganizationSummary } from '@/types/event';
import { eventCoverUrl, formatEventWhen, formatMoney, lowestPriceLabel, mediaUrl, ticketAvailability } from '@/lib/event-display';
import { c } from '@/ui/tokens';
import type { IconName } from '@/ui/Icon';
import { dateLabel, homeCard, plainDescription, venueAddress } from './model';

const image = (url?: string | null) => url ? { uri: url } : null;
export function categoryIcon(name: string): IconName {
  if (/concert|music|live/i.test(name)) return 'music';
  if (/festival|cultur/i.test(name)) return 'flag';
  if (/comed/i.test(name)) return 'mic';
  if (/sport/i.test(name)) return 'trophy';
  if (/meetup|communit/i.test(name)) return 'users';
  return 'grid';
}
export const initials = (name: string) => name.split(/\s+/).slice(0, 2).map(word => word[0] ?? '').join('');

export function eventRow(event: Event) {
  return { ...homeCard(event), date: formatEventWhen(event.start, event.end), venue: event.venue?.name ?? '',
    org: event.organization?.name ?? '', tag: '', raw: event };
}

export function listDesign(events: Event[], categories: EventCategory[], venues: EventVenue[]) {
  const organizations = [...new Map(events.flatMap(event => event.organization ? [[event.organization.id, event.organization] as const] : [])).values()];
  const organisers = organizations.map(org => ({ id: org.id, name: org.name, initials: initials(org.name),
    meta: `${events.filter(event => event.organization?.id === org.id).length} events`,
    bg: c.blue, fg: c.white, verified: false, following: false, description: plainDescription(org.description),
  }));
  return {
    categories: categories.map(category => ({ ...category,
      count: `${events.filter(event => event.category?.id === category.id || event.category_id === category.id).length} events`,
      img: image(mediaUrl(category.icon) || eventCoverUrl(events.find(event => event.category?.id === category.id || event.category_id === category.id) ?? {})),
    })), organisers, organizer: organisers[0],
    venuesList: venues.map(venue => ({ id: venue.id, name: venue.name, img: image(mediaUrl(venue.images?.[0])),
      type: venue.is_seat ? 'Seated venue' : 'Venue', area: venueAddress(venue),
      events: `${events.filter(event => event.venue_id === venue.id || event.venue?.id === venue.id).length} events`, dist: '' })),
    categoryEvents: events.map(eventRow), resultEvents: events.map(eventRow),
    resultVenues: venues.map(venue => ({ id: venue.id, name: venue.name, meta: venueAddress(venue) })),
    trending: events.slice(0, 4).map((event, index) => ({ n: String(index + 1), q: event.name, cat: event.category?.name ?? 'Event' })),
    browseLinks: [...categories.map(category => category.name), 'Organisers', 'Venues', 'Free events'],
    hero: image(eventCoverUrl(events[0] ?? {})),
  };
}

export type ListDesign = ReturnType<typeof listDesign>;

export function eventDesign(data: Event, related: Event[] = []) {
  const row = homeCard(data);
  const remaining = Math.max(0, Date.parse(data.start) - Date.now());
  const organizer = data.organization;
  return {
    event: {
      ...row, fullName: data.name, nameAccent: '', category: data.category?.name ?? 'Event',
      organiser: { id: organizer?.id ?? '', initials: initials(organizer?.name ?? ''), name: organizer?.name ?? 'Organiser', upcoming: '' },
      weekday: new Date(data.start).toLocaleDateString('en-LK', { weekday: 'short' }).toUpperCase(),
      time: formatEventWhen(data.start, data.end), doors: '', dateLine: dateLabel(data.start),
      venue: data.venue?.name ?? 'Venue to be announced', venueId: data.venue?.id,
      venueImage: image(mediaUrl(data.venue?.images?.[0])), shortVenue: data.venue?.name ?? '', address: venueAddress(data.venue),
      countdown: [[String(Math.floor(remaining / 86400000)).padStart(2, '0'), 'Days'], [String(Math.floor(remaining / 3600000) % 24).padStart(2, '0'), 'Hours'], [String(Math.floor(remaining / 60000) % 60).padStart(2, '0'), 'Mins']],
      about: plainDescription(data.description), tags: (data.tags ?? []).map(tag => tag.name),
      facts: [{ k: 'Status', v: data.status }, ...(data.ticket_limit ? [{ k: 'Tickets per order', v: String(data.ticket_limit) }] : [])],
      more: related.filter(event => event.id !== data.id).map(eventRow),
      fromPrice: lowestPriceLabel(data) ?? 'Pricing TBA', categorySlug: data.category?.slug,
    },
    tiers: (data.ticket_categories ?? []).map((ticket, index) => ({ name: ticket.name,
      priceLabel: formatMoney(ticket.price) ?? 'Pricing TBA', dot: [c.ink, c.blue, c.periwinkle, c.pale][index % 4],
      avail: ticket.is_closed ? 'Closed' : ticketAvailability(ticket) === null ? 'On sale' : `${ticketAvailability(ticket)} available`, fast: false,
    })),
    raw: data,
  };
}

export type EventDesign = ReturnType<typeof eventDesign>;

export function venueDesign(data: EventVenue) {
  return {
    venue: { id: data.id, name: data.name, nameAccent: '', type: data.is_seat ? 'Venue · Seated' : 'Venue',
      address: venueAddress(data), img: image(mediaUrl(data.images?.[0])),
      stats: [[String(data.events?.length ?? 0), 'Events'], ['—', 'Seats'], ['—', 'Followers']],
      events: (data.events ?? []).map(eventRow), about: data.description ? plainDescription(data.description) : 'Venue details are provided by the organiser for each event.',
      facilities: (data.venue_features ?? []).map(item => item.feature.name),
      past: (data.images ?? []).slice(1).map(asset => image(mediaUrl(asset))),
      contact: [] as string[][],
    }, raw: data,
  };
}
export type VenueDesign = ReturnType<typeof venueDesign>;

export function organizerDesign(organization: OrganizationSummary | null | undefined, events: Event[]) {
  return { name: organization?.name ?? 'Organiser', initials: initials(organization?.name ?? ''),
    about: plainDescription(organization?.description), hero: image(mediaUrl(organization?.org_image) || eventCoverUrl(events[0] ?? {})),
    events: events.map(eventRow), stats: [[String(events.length), 'Events'], ['—', 'Hosted'], ['—', 'Followers']],
  };
}
export type OrganizerDesign = ReturnType<typeof organizerDesign>;
