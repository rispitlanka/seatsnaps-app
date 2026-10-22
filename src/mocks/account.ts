/** Sample content for the profile, promotions and account boards (board 2). */
import { img } from '@/ui/assets';
import { c } from '@/ui/tokens';
import type { IconName } from '@/ui/Icon';

export const venue = {
  id: 'nelum-pokuna-theatre',
  name: 'Nelum Pokuna',
  nameAccent: 'Theatre',
  type: 'Venue · Theatre',
  address: 'Ananda Kumaraswamy Mawatha, Colombo 07',
  stats: [
    ['6', 'Upcoming'],
    ['[n]', 'Seats'],
    ['[n]', 'Followers'],
  ],
  events: [
    { id: 'tamil-fest-2026', mon: 'OCT', day: '24', name: 'Tamil Fest 2026', meta: 'Sat · 7:30 PM · Festival', price: 'LKR 2,000+' },
    { id: 'symphony-under-lights', mon: 'NOV', day: '06', name: 'Symphony Under Lights', meta: 'Fri · 7:00 PM · Concert', price: 'LKR 3,500+' },
    { id: 'deepavali-nights', mon: 'NOV', day: '14', name: 'Deepavali Nights', meta: 'Sat · 6:30 PM · Cultural', price: 'LKR 1,500+' },
  ],
  about: '[Venue description — history, the kind of shows it hosts, seating style and what makes a night here special.]',
  facilities: ['Free parking', 'Wheelchair access', 'Air-conditioned', 'Café & snacks', 'Cloakroom', 'Card payments'],
  past: [img.crowd, img.comedy, img.festivalNight],
  contact: [
    ['Box office', '[Hours]'],
    ['Phone', '[Phone]'],
    ['Website', '[Website]'],
  ],
};

export const profileStats = [
  ['MEMBER', 'Oct 2026', 'since'],
  ['TICKETS', '2', 'purchased'],
  ['EVENTS', '0', 'attended'],
];

export type MenuItem = { label: string; sub: string; icon: IconName; href: string };

export const profileMenu: MenuItem[] = [
  { label: 'My tickets & bookings', sub: '2 upcoming · 3 tickets', icon: 'ticket', href: '/me/tickets' },
  { label: 'Saved events', sub: '3 saved', icon: 'heart', href: '/me/saved' },
  { label: 'Following', sub: '3 organisers · 2 venues', icon: 'users', href: '/me/following' },
  { label: 'Payment methods', sub: '1 card saved', icon: 'card', href: '/me/payments' },
  { label: 'Notifications', sub: 'Enabled', icon: 'bell', href: '/me/notifications' },
];

export const settingsMenu: MenuItem[] = [
  { label: 'Account settings', sub: 'Name, email, city', icon: 'gear', href: '/me/account' },
  { label: 'Security', sub: 'Password, sign-in', icon: 'shield', href: '/me/security' },
  { label: 'Help & support', sub: 'FAQ, contact us', icon: 'help', href: '/help' },
  { label: 'Become an organiser', sub: 'Sell tickets on SeatSnaps', icon: 'mic', href: '/become-organiser' },
];

export const savedEvents = [
  { id: 'colombo-jazz-nights', img: img.concert, date: 'Fri 30 Oct · 8:00 PM', name: 'Colombo Jazz Nights', venue: 'Galle Face', price: 'LKR 4,500', tag: 'Selling fast', tagColor: c.urgent },
  { id: 'colombo-derby-night', img: img.crowd, date: 'Sat 7 Nov · 6:30 PM', name: 'Colombo Derby Night', venue: 'Sugathadasa Stadium', price: 'LKR 1,500', tag: 'On sale', tagColor: c.success },
  { id: 'stand-up-saturdays', img: img.comedy, date: 'Sat 17 Oct · 8:00 PM', name: 'Stand-up Saturdays', venue: 'Colombo 03', price: 'LKR 2,000', tag: 'On sale', tagColor: c.success },
];

export type NotifItem = { id: string; label: string; sub: string; locked?: boolean };

export const notificationGroups: { title: string; items: NotifItem[] }[] = [
  {
    title: 'TICKETS & EVENTS',
    items: [
      { id: 'confirm', label: 'Booking confirmations', sub: 'Always on — your tickets live here', locked: true },
      { id: 'remind', label: 'Event reminders', sub: 'A day before and 2 hours before' },
      { id: 'changes', label: 'Time or venue changes', sub: 'If an organiser updates your event' },
    ],
  },
  {
    title: 'DISCOVER',
    items: [
      { id: 'follow', label: 'Organisers you follow', sub: 'When they announce new events' },
      { id: 'drops', label: 'Saved events', sub: 'Low ticket alerts and price changes' },
      { id: 'promos', label: 'Promotions & offers', sub: 'Promo codes and early-bird deals' },
    ],
  },
  {
    title: 'HOW WE REACH YOU',
    items: [
      { id: 'push', label: 'Push notifications', sub: 'On this phone' },
      { id: 'email', label: 'Email', sub: '{email}' },
      { id: 'sms', label: 'SMS', sub: '+94 77 ••• ••67' },
    ],
  },
];

export const defaultNotifications: Record<string, boolean> = {
  confirm: true, remind: true, changes: true, follow: true, drops: true, promos: false, push: true, email: true, sms: false,
};

export const promoChips = ['All', 'Codes', 'Early bird', 'Bundles', 'Partners'];

export const promoCodes = [
  { big: 'LKR', small: '1,000 OFF', bg: c.blue, fg: c.white, title: 'Early bird · Tamil Fest', terms: '2+ Gold or VIP tickets · ends Sun 18 Oct', code: 'EARLYBIRD' },
  { big: '15%', small: 'OFF', bg: c.ink, fg: c.white, title: 'Your first booking', terms: 'Any event · up to LKR 1,500 off', code: 'FIRSTSNAP' },
  { big: '2+', small: 'COMEDY', bg: c.blueSoft, fg: c.blueDeep, title: '10% off comedy for groups', terms: '2 or more tickets · comedy events', code: 'LAUGH10' },
];

export const earlyBird = [
  { id: 'colombo-jazz-nights', img: img.concert, save: 'Save 20%', date: 'Fri 30 Oct', name: 'Colombo Jazz Nights', now: 'LKR 3,600', was: 'LKR 4,500' },
  { id: 'colombo-derby-night', img: img.crowd, save: 'Save 30%', date: 'Sat 7 Nov', name: 'Colombo Derby Night', now: 'LKR 1,050', was: 'LKR 1,500' },
  { id: 'colombo-food-fair', img: img.expo, save: 'Save 25%', date: 'Sat 31 Oct', name: 'Colombo Food Fair', now: 'LKR 750', was: 'LKR 1,000' },
];

export const partnerDeals = [
  { title: '[Bank] card holders · 10% off', sub: 'Concerts and festivals · weekends' },
  { title: '[Partner] rides · LKR 300 off', sub: 'Your ride home after any event' },
];

export const promoTerms = ['One use per account.', "Can't be combined with other codes.", "Booking fee isn't discounted.", '[Any organiser-specific terms]'];

export const promoSteps = ['Choose 2+ Gold or VIP tickets', 'Enter EARLYBIRD at checkout', 'The discount shows in your total'];

export const cities = [
  ['Colombo', '42 events'],
  ['Jaffna', '9 events'],
  ['Kandy', '11 events'],
  ['Galle', '7 events'],
  ['Negombo', '5 events'],
  ['Trincomalee', '3 events'],
  ['Batticaloa', '4 events'],
];

export const pushSamples = [
  { time: 'now', text: 'Tamil Fest starts in 2 hours. Doors open 6:45 PM — your tickets are ready.', rot: '-2deg', op: 0.97 },
  { time: '1h ago', text: 'Colombo Jazz Nights is selling fast — only 20 seats left.', rot: '1.5deg', op: 0.9 },
  { time: 'Mon', text: 'Pulse Live LK just announced a new event.', rot: '-1deg', op: 0.8 },
];
