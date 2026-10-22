/** Sample content for discovery extras, booking edge cases and support (board 3). */
import { img } from '@/ui/assets';
import type { IconName } from '@/ui/Icon';

/** How an event's ticket flow behaves. Events not listed are seated (D2–D4). */
export type EventKind = 'seated' | 'multi' | 'ga' | 'rsvp' | 'soldout' | 'cancelled' | 'postponed';

export const eventKinds: Record<string, EventKind> = {
  'colombo-food-fair': 'ga',
  'colombo-comedy-week': 'multi',
  'tamil-classics-unplugged': 'multi',
  'board-game-hangout-6': 'rsvp',
  'nexus-career-fair': 'rsvp',
  'colombo-jazz-nights': 'soldout',
  'sunday-sessions': 'cancelled',
  'stand-up-saturdays': 'postponed',
};

export const kindOf = (id: string): EventKind => eventKinds[id] ?? 'seated';

export type InboxItem = { kind: 'alert' | 'fire' | 'tag' | 'ticket' | 'mic'; title: string; body: string; time: string; unread: boolean; href: string };

export const inbox: { title: string; items: InboxItem[] }[] = [
  {
    title: 'TODAY',
    items: [
      { kind: 'alert', title: 'Time change', body: 'Stand-up Saturdays now starts at 8:30 PM. Your tickets are still valid.', time: '2h', unread: true, href: '/event/stand-up-saturdays' },
      { kind: 'fire', title: 'Selling fast', body: 'Colombo Jazz Nights — only 20 seats left. You saved this event.', time: '4h', unread: true, href: '/event/tamil-fest-2026' },
      { kind: 'tag', title: 'New code for you', body: 'EARLYBIRD: LKR 1,000 off Tamil Fest. Ends Sunday.', time: '6h', unread: true, href: '/promo/earlybird' },
    ],
  },
  {
    title: 'EARLIER',
    items: [
      { kind: 'ticket', title: 'Booking confirmed', body: 'Tamil Fest 2026 · 2 × Gold · Seats G5, G6.', time: 'Mon', unread: false, href: '/me/booking/ss-2410' },
      { kind: 'mic', title: 'Pulse Live LK announced', body: 'Indie Night Live — Sat 17 Oct, Colombo 03.', time: 'Sun', unread: false, href: '/explore/organiser/pulse-live-lk' },
      { kind: 'ticket', title: 'Welcome to SeatSnaps', body: 'Find your night — save events to get reminders.', time: 'Oct 10', unread: false, href: '/' },
    ],
  },
];

export const inboxIcon: Record<InboxItem['kind'], IconName> = { alert: 'alert', fire: 'trending', tag: 'tag', ticket: 'ticket', mic: 'mic' };

export const mapPins = [
  { id: 'colombo-jazz-nights', x: 120, y: 200, price: 'LKR 4,500', name: 'Colombo Jazz Nights', date: 'Fri 30 Oct · 8:00 PM', venue: 'Galle Face', dist: '3.1 km', img: img.concert },
  { id: 'tamil-fest-2026', x: 236, y: 300, price: 'LKR 2,000', name: 'Tamil Fest 2026', date: 'Sat 24 Oct · 7:30 PM', venue: 'Nelum Pokuna', dist: '1.2 km', img: img.festival },
  { id: 'board-game-hangout-6', x: 160, y: 380, price: 'Free', name: 'Board Game Hangout 6', date: 'Sat 17 Oct · 4:00 PM', venue: 'Colombo 07', dist: '0.8 km', img: img.boardGames },
  { id: 'colombo-derby-night', x: 290, y: 450, price: 'LKR 1,500', name: 'Colombo Derby Night', date: 'Sat 7 Nov · 6:30 PM', venue: 'Sugathadasa Stadium', dist: '2.4 km', img: img.crowd },
  { id: 'stand-up-saturdays', x: 100, y: 520, price: 'LKR 2,000', name: 'Stand-up Saturdays', date: 'Sat 17 Oct · 8:00 PM', venue: 'Colombo 03', dist: '1.9 km', img: img.comedy },
  { id: 'nexus-career-fair', x: 250, y: 560, price: 'Free', name: 'Nexus Career Fair', date: 'Thu 12 Nov · 9:00 AM', venue: 'BMICH', dist: '1.5 km', img: img.expo },
];

export const venueFilters = ['Nearest', 'Theatres', 'Outdoor', 'Stadiums', 'Clubs'];

export const venuesList = [
  { id: 'nelum-pokuna-theatre', img: img.theatre, name: 'Nelum Pokuna Theatre', type: 'Theatre', area: 'Colombo 07', events: '6 upcoming', dist: '1.2 km' },
  { id: 'sugathadasa-stadium', img: img.crowd, name: 'Sugathadasa Stadium', type: 'Stadium', area: 'Colombo 13', events: '3 upcoming', dist: '2.4 km' },
  { id: 'galle-face-green', img: img.festivalNight, name: 'Galle Face Green', type: 'Outdoor', area: 'Colombo 01', events: '6 upcoming', dist: '3.1 km' },
  { id: 'bmich', img: img.expo, name: 'BMICH', type: 'Convention centre', area: 'Colombo 07', events: '4 upcoming', dist: '1.5 km' },
  { id: 'the-jazz-room', img: img.comedy, name: 'The Jazz Room', type: 'Club', area: 'Colombo 03', events: '2 upcoming', dist: '1.9 km' },
];

export const gaTiers = [
  { name: 'Early bird', price: 750, perk: 'Entry + 1 tasting token', soldOut: true },
  { name: 'General entry', price: 1000, perk: 'Entry + 1 tasting token', soldOut: false },
  { name: 'Family pass', price: 3500, perk: '2 adults + 2 kids · 4 tokens', soldOut: false },
];

export const quickDates: [string, number, number][] = [
  ['Today', 14, 14],
  ['Tomorrow', 15, 15],
  ['This weekend', 17, 18],
  ['Next 7 days', 14, 20],
];

export const refundReasons = ["Can't attend", 'Bought by mistake', 'Event changed', 'Other'];

export const helpTopics = [
  { name: 'Tickets & entry', n: '12 articles' },
  { name: 'Payments & refunds', n: '9 articles' },
  { name: 'My account', n: '7 articles' },
  { name: 'For organisers', n: '15 articles' },
];

export const faqs: [string, string][] = [
  ['Where are my tickets?', 'Open Profile → My tickets & bookings. Your tickets are also emailed to you and work offline once opened.'],
  ['Can I get a refund?', 'Most events allow refunds up to 48 hours before the start. Open the booking and tap "Cancel booking & request refund". The booking fee is not refundable.'],
  ['How do I send a ticket to a friend?', 'Open the booking, tap Send next to the seat and enter their email or phone. They get their own QR code.'],
  ['The event was cancelled. What now?', 'You are refunded automatically to your original payment method within 5–7 working days.'],
  ['My payment failed but money was taken', 'Failed payments are reversed by your bank, usually within 3 working days. If not, contact us with your order number.'],
];

export const contactTopics = ['Tickets', 'Payment', 'Refund', 'Account', 'Other'];

export const legal = {
  terms: ['Using SeatSnaps', 'Buying tickets', 'Refunds & cancellations', 'Transfers & resale', 'Your account'],
  privacy: ['What we collect', 'How we use it', 'Sharing with organisers', 'Your choices', 'Contact us'],
};

export const organiserPerks = [
  { t: 'Seat maps or general admission', d: 'Build sections and tiers, or sell simple entry passes.' },
  { t: 'Free events too', d: 'Take RSVPs with a QR pass — no payment needed.' },
  { t: 'Scan at the door', d: 'Use the organiser app to check guests in, even offline.' },
  { t: 'Payouts to your bank', d: 'Track sales live and get paid after the event. Fees: [fee terms].' },
];

export const organiserSteps = ['Create your organiser profile', 'Verify your identity and bank details', 'Publish your first event'];

/** Search terms with matches in the sample data (others show the no-results state). */
export const searchable = [
  'jazz', 'tamil', 'comedy', 'colombo', 'festival', 'concert', 'derby', 'stand-up', 'halloween', 'free', 'indie', 'music',
];
