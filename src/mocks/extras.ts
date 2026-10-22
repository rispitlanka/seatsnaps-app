/** Sample content for app states and extras (board 4). */
import { img } from '@/ui/assets';
import { c } from '@/ui/tokens';

/** Multi-date event (L1): dates and the shows on each. */
export const showDays: { n: number; dow: string; count: number }[] = [
  { n: 16, dow: 'FRI', count: 1 },
  { n: 17, dow: 'SAT', count: 3 },
  { n: 18, dow: 'SUN', count: 2 },
  { n: 23, dow: 'FRI', count: 1 },
  { n: 24, dow: 'SAT', count: 1 },
];

export type Show = { time: string; label: string; avail: string; price: string; soldOut?: boolean };

export const showsByDay: Record<number, Show[]> = {
  16: [{ time: '8:00 PM', label: 'Opening night', avail: 'Selling fast', price: 'LKR 2,500' }],
  17: [
    { time: '4:00 PM', label: 'Family matinee', avail: 'Available', price: 'LKR 1,500' },
    { time: '7:30 PM', label: 'Main show', avail: 'Only 18 left', price: 'LKR 2,000' },
    { time: '10:00 PM', label: 'Late show · 18+', avail: 'Sold out', price: '—', soldOut: true },
  ],
  18: [
    { time: '5:00 PM', label: 'Main show', avail: 'Available', price: 'LKR 2,000' },
    { time: '8:30 PM', label: 'Main show', avail: 'Available', price: 'LKR 2,000' },
  ],
  23: [{ time: '8:00 PM', label: 'Main show', avail: 'Available', price: 'LKR 2,000' }],
  24: [{ time: '8:00 PM', label: 'Closing night', avail: 'Available', price: 'LKR 2,500' }],
};

/** Promo codes that look valid but fail (L4); EARLYBIRD is the working sample code. */
export const promoErrors: Record<string, [string, string]> = {
  SUMMER25: ['This code expired on 30 Sep.', 'Look for current offers in Promotions.'],
  LAUGH10: ['This code needs 2+ comedy tickets.', 'It doesn’t apply to Tamil Fest tickets.'],
  FIRSTSNAP: ["You've already used this code.", 'First-booking codes work once per account.'],
};
export const unknownPromo: [string, string] = ["We couldn't find that code.", 'Check the spelling — codes are not case-sensitive.'];

export const ratingWords = ['', 'Not great', 'It was okay', 'Good night', 'Great night', 'Unforgettable'];
export const ratingTags = ['Performers', 'Sound', 'Venue', 'Organisation', 'Food & drinks', 'Value for money'];

export type Followed = { id: string; name: string; meta: string; initials?: string; bg?: string; fg?: string; img?: number };

export const followedOrganisers: Followed[] = [
  { id: 'tamil-arts-circle', initials: 'TA', name: 'Tamil Arts Circle', meta: '3 upcoming · next Sat 24 Oct', bg: c.ink, fg: c.white },
  { id: 'pulse-live-lk', initials: 'PL', name: 'Pulse Live LK', meta: '8 upcoming · next Sat 17 Oct', bg: c.blue, fg: c.white },
  { id: 'colombo-comedy-co', initials: 'CC', name: 'Colombo Comedy Co.', meta: '5 upcoming · next Sat 17 Oct', bg: c.blueSoft, fg: c.blueDeep },
];

export const followedVenues: Followed[] = [
  { id: 'nelum-pokuna-theatre', img: img.theatre, name: 'Nelum Pokuna Theatre', meta: '6 upcoming · Colombo 07' },
  { id: 'galle-face-green', img: img.festivalNight, name: 'Galle Face Green', meta: '6 upcoming · Colombo 01' },
];
