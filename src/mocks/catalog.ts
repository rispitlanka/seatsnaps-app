/**
 * Sample content from the design boards. Screens render from this until they
 * are connected to the SeatSnaps API. Photos the board export omitted
 * (/_blob/ images) use the closest bundled photograph.
 */
import { img } from '@/ui/assets';
import { c } from '@/ui/tokens';
import type { IconName } from '@/ui/Icon';

const photo = {
  festival: img.festival,
  concert: img.concert,
  jazz: img.crowd,
  comedy: img.comedy,
  games: img.boardGames,
  folk: img.festivalNight,
  sports: img.crowd,
  expo: img.expo,
};

export const featured = [
  { id: 'tamil-fest-2026', img: photo.festival, mon: 'OCT', day: '24', cat: 'Festival', name: 'Tamil Fest 2026', meta: 'Nelum Pokuna · 7:30 PM', price: 'From LKR 5,000' },
  { id: 'colombo-jazz-nights', img: photo.concert, mon: 'OCT', day: '30', cat: 'Concert', name: 'Colombo Jazz Nights', meta: 'Galle Face · 8:00 PM', price: 'From LKR 4,500' },
];

export const whenOptions = ['Today', 'Tomorrow', 'This weekend', 'Next week'];

export const weekend = [
  { id: 'stand-up-saturdays', img: photo.comedy, date: 'SAT 17', name: 'Stand-up Saturdays', meta: 'Colombo 03 · 8:00 PM', price: 'LKR 2,000' },
  { id: 'board-game-hangout-6', img: photo.games, date: 'SAT 17', name: 'Board Game Hangout 6', meta: 'Colombo 07 · 4:00 PM', price: 'Free' },
  { id: 'scarborough-folk-fest', img: photo.folk, date: 'SUN 18', name: 'Scarborough Folk Fest', meta: 'Viharamahadevi Park', price: 'LKR 2,500' },
];

export type Organiser = { id: string; initials: string; name: string; meta: string; bg: string; fg: string; verified?: boolean; following?: boolean };

export const topOrganisers: Organiser[] = [
  { id: 'pulse-live-lk', initials: 'PL', name: 'Pulse Live LK', meta: '8 upcoming', bg: c.blue, fg: c.white },
  { id: 'tamil-arts-circle', initials: 'TA', name: 'Tamil Arts Circle', meta: '3 upcoming', bg: c.ink, fg: c.white },
  { id: 'colombo-comedy-co', initials: 'CC', name: 'Colombo Comedy Co.', meta: '5 upcoming', bg: c.blueSoft, fg: c.blueDeep },
];

export const nearYou = [
  { id: 'colombo-derby-night', img: photo.sports, date: 'Sat 7 Nov · 6:30 PM', name: 'Colombo Derby Night', meta: 'Sugathadasa Stadium', price: 'LKR 1,500', dist: '2.4 km' },
  { id: 'colombo-jazz-nights', img: photo.jazz, date: 'Fri 30 Oct · 8:00 PM', name: 'Colombo Jazz Nights', meta: 'Galle Face', price: 'LKR 4,500', dist: '3.1 km' },
  { id: 'nexus-career-fair', img: photo.expo, date: 'Thu 12 Nov · 9:00 AM', name: 'Nexus Career Fair', meta: 'BMICH, Colombo 07', price: 'Free', dist: '4.8 km' },
];

export const homeCategories: { slug: string; label: string; icon: IconName }[] = [
  { slug: 'concerts', label: 'Concerts', icon: 'music' },
  { slug: 'festivals', label: 'Festivals', icon: 'flag' },
  { slug: 'comedy', label: 'Comedy', icon: 'mic' },
  { slug: 'sports', label: 'Sports', icon: 'trophy' },
  { slug: 'meetups', label: 'Meetups', icon: 'users' },
];

export const categories = [
  { slug: 'concerts', name: 'Concerts', count: '24 events', img: photo.jazz },
  { slug: 'festivals', name: 'Festivals', count: '9 events', img: photo.folk },
  { slug: 'comedy', name: 'Comedy', count: '7 events', img: photo.comedy },
  { slug: 'sports', name: 'Sports', count: '15 events', img: photo.sports },
  { slug: 'meetups', name: 'Meetups', count: '18 events', img: photo.games },
  { slug: 'careers', name: 'Careers & expos', count: '6 events', img: photo.expo },
  { slug: 'live-music', name: 'Live music', count: '12 events', img: photo.concert },
  { slug: 'cultural', name: 'Cultural', count: '11 events', img: photo.festival },
];

export const categoryEvents = [
  { id: 'indie-night-live', img: photo.jazz, mon: 'OCT', day: '17', name: 'Indie Night Live', meta: 'Sat · 7:00 PM · Colombo 03', org: 'Pulse Live LK', price: 'LKR 3,000', tag: 'Selling fast' },
  { id: 'sunday-sessions', img: photo.concert, mon: 'OCT', day: '18', name: 'Sunday Sessions', meta: 'Sun · 5:30 PM · Mount Lavinia', org: 'Island Sound Co.', price: 'LKR 2,500', tag: '' },
  { id: 'baila-beats-open-air', img: photo.festival, mon: 'OCT', day: '18', name: 'Baila Beats Open Air', meta: 'Sun · 6:00 PM · Galle Face', org: 'Pulse Live LK', price: 'LKR 1,500', tag: '40 seats left' },
  { id: 'acoustic-rooftop', img: photo.jazz, mon: 'OCT', day: '18', name: 'Acoustic Rooftop', meta: 'Sun · 8:00 PM · Colombo 02', org: 'Island Sound Co.', price: 'LKR 4,000', tag: '' },
  { id: 'tamil-classics-unplugged', img: photo.concert, mon: 'OCT', day: '17', name: 'Tamil Classics Unplugged', meta: 'Sat · 6:30 PM · Wellawatte', org: 'Tamil Arts Circle', price: 'LKR 2,000', tag: '' },
  { id: 'dj-night-on-the-lake', img: photo.folk, mon: 'OCT', day: '17', name: 'DJ Night on the Lake', meta: 'Sat · 9:00 PM · Beira Lake', org: 'Pulse Live LK', price: 'LKR 4,500', tag: 'Selling fast' },
];

export const organisers: Organiser[] = [
  { id: 'tamil-arts-circle', initials: 'TA', name: 'Tamil Arts Circle', verified: true, meta: 'Festivals · 3 upcoming', bg: c.ink, fg: c.white, following: true },
  { id: 'colombo-comedy-co', initials: 'CC', name: 'Colombo Comedy Co.', verified: true, meta: 'Comedy · 5 upcoming', bg: c.blueSoft, fg: c.blueDeep },
  { id: 'island-sound-co', initials: 'IS', name: 'Island Sound Co.', meta: 'Concerts · 4 upcoming', bg: c.blue, fg: c.white },
  { id: 'dice-and-brews', initials: 'DB', name: 'Dice & Brews', meta: 'Meetups · 2 upcoming', bg: c.navy, fg: c.white },
  { id: 'nexus-careers', initials: 'NC', name: 'Nexus Careers', verified: true, meta: 'Expos · 1 upcoming', bg: c.blueSoft, fg: c.blueDeep },
];

export const organiserFilters = ['All', 'Following', 'Verified', 'Music', 'Comedy'];

export const organiserEvents = [
  { id: 'indie-night-live', img: photo.jazz, date: 'Sat 17 Oct · 7:00 PM', name: 'Indie Night Live', venue: 'Colombo 03', price: 'LKR 3,000' },
  { id: 'baila-beats-open-air', img: photo.festival, date: 'Sun 18 Oct · 6:00 PM', name: 'Baila Beats Open Air', venue: 'Galle Face Green', price: 'LKR 1,500' },
  { id: 'dj-night-on-the-lake', img: photo.folk, date: 'Sat 17 Oct · 9:00 PM', name: 'DJ Night on the Lake', venue: 'Beira Lake', price: 'LKR 4,500' },
  { id: 'colombo-jazz-nights', img: photo.concert, date: 'Fri 30 Oct · 8:00 PM', name: 'Colombo Jazz Nights', venue: 'Galle Face', price: 'LKR 4,500' },
];

export const recentSearches = ['jazz', 'Tamil Fest', 'comedy this weekend'];

export const trending = [
  { n: '1', q: 'Colombo Jazz Nights', cat: 'Concert · Fri 30 Oct' },
  { n: '2', q: 'Colombo Derby Night', cat: 'Sports · Sat 7 Nov' },
  { n: '3', q: 'Stand-up Saturdays', cat: 'Comedy · Every Saturday' },
  { n: '4', q: 'Halloween parties', cat: 'Search term' },
];

export const browseLinks = ['Concerts', 'Festivals', 'Comedy', 'Sports', 'Meetups', 'Organisers', 'Venues', 'Free events'];

export const resultEvents = [
  { id: 'late-night-jazz-lounge', img: photo.jazz, date: 'Sat 17 Oct · 9:00 PM', name: 'Late-Night Jazz Lounge', venue: 'Colombo 02', price: 'LKR 3,500' },
  { id: 'jazz-and-poetry-evening', img: photo.comedy, date: 'Thu 22 Oct · 7:30 PM', name: 'Jazz & Poetry Evening', venue: 'Colombo 07', price: 'LKR 1,500' },
  { id: 'sunset-jazz-on-the-green', img: photo.festival, date: 'Sun 1 Nov · 5:00 PM', name: 'Sunset Jazz on the Green', venue: 'Galle Face Green', price: 'Free' },
];

export const resultVenues = [
  { id: 'the-jazz-room', name: 'The Jazz Room', meta: 'Colombo 03 · 2 events this month' },
  { id: 'galle-face-green', name: 'Galle Face Green', meta: 'Colombo 01 · 6 events this month' },
];

/** Event detail (D1). */
export const event = {
  id: 'tamil-fest-2026',
  name: 'Tamil Fest',
  nameAccent: '2026',
  fullName: 'Tamil Fest 2026',
  category: 'Festival',
  img: img.festival,
  organiser: { id: 'tamil-arts-circle', initials: 'TA', name: 'Tamil Arts Circle', upcoming: '3 upcoming events' },
  mon: 'OCT',
  day: '24',
  weekday: 'SAT',
  time: '7:30 PM – 11:00 PM',
  doors: 'Doors open 6:45 PM',
  venue: 'Nelum Pokuna Theatre',
  shortVenue: 'Nelum Pokuna',
  address: 'Ananda Kumaraswamy Mawatha, Colombo 07',
  dateLine: 'Sat 24 Oct · 7:30 PM',
  countdown: [
    ['10', 'Days'],
    ['04', 'Hours'],
    ['25', 'Mins'],
  ],
  about:
    "[Event description — a short paragraph on the lineup, the performers, what the night includes, and who it's for. Keep the first two lines strong: they show before \"Read more\".]",
  tags: ['Music', 'Dance', 'Food stalls', 'Family friendly'],
  facts: [
    { k: 'Age', v: 'All ages' },
    { k: 'Duration', v: '3 hrs 30 mins' },
    { k: 'Parking', v: 'On-site, free' },
    { k: 'Refunds', v: 'Up to 48 hrs before' },
  ],
  more: [
    { id: 'scarborough-folk-fest', img: photo.folk, date: 'Sun 18 Oct', name: 'Scarborough Folk Fest', price: 'LKR 2,500' },
    { id: 'colombo-food-fair', img: photo.expo, date: 'Sat 31 Oct', name: 'Colombo Food Fair', price: 'From LKR 750' },
    { id: 'deepavali-nights', img: photo.concert, date: 'Sat 14 Nov', name: 'Deepavali Nights', price: 'LKR 1,500' },
  ],
  fromPrice: 'LKR 2,000',
};

export type Tier = { name: string; price: number; perk: string; avail: string; fast: boolean; dot: string };

export const tiers: Tier[] = [
  { name: 'VIP', price: 8000, perk: 'Front rows · welcome drink', avail: 'Only 12 left', fast: true, dot: c.ink },
  { name: 'Gold', price: 5000, perk: 'Rows E–J · centre view', avail: 'Available', fast: false, dot: c.blue },
  { name: 'Silver', price: 3000, perk: 'Rows K–R', avail: 'Available', fast: false, dot: c.periwinkle },
  { name: 'Balcony', price: 2000, perk: 'Upper level', avail: 'Available', fast: false, dot: c.pale },
];

export const sections = [
  { name: 'Gold Left', short: 'Left', left: '9 left', note: 'Side view · aisle seats' },
  { name: 'Gold Centre', short: 'Centre', left: '18 left', note: 'Best view of the stage' },
  { name: 'Gold Right', short: 'Right', left: '6 left', note: 'Side view · near exit' },
];

export const seatRows = ['E', 'F', 'G', 'H', 'I', 'J'];
export const takenSeats = ['E1', 'E2', 'E9', 'F4', 'F5', 'F6', 'G1', 'G10', 'H3', 'H7', 'H8', 'I5', 'I6', 'J1', 'J2', 'J9', 'J10'];

export const paymentMethods = [
  { id: 'card', name: 'Credit or debit card', note: 'Visa, Mastercard, Amex' },
  { id: 'wallet', name: 'Mobile wallet', note: 'Pay from your phone wallet' },
  { id: 'bank', name: 'Online banking', note: 'Pay from your bank account' },
] as const;

export const BOOKING_FEE = 300;
export const PROMO_DISCOUNT = 1000;
export const MAX_TICKETS = 6;

export const lkr = (n: number) => 'LKR ' + n.toLocaleString('en-US');
