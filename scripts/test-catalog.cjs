const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

function load(relative, overrides = {}) {
  const filename = path.resolve(root, relative);
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, { module, exports: module.exports, console,
    require: request => {
      if (request in overrides) return overrides[request];
      if (request.startsWith('@/')) return load(`src/${request.slice(2)}.ts`, overrides);
      return load(path.relative(root, path.resolve(path.dirname(filename), `${request}.ts`)), overrides);
    },
  }, { filename });
  return module.exports;
}

async function main() {
  const model = load('src/features/catalog/model.ts');
  const first = { id: 'one', name: 'Jazz at the beach', status: 'PUBLISHED', start: '2026-10-31T18:00:00Z', end: '2026-11-01T01:00:00Z',
    category: { id: 'music', name: 'Concerts' }, organization: { id: 'org', name: 'Island Music' },
    venue_id: 'venue', venue: { id: 'venue', name: 'Ocean Stage', address: 'Beach Road', venue_city: { name: 'Galle' } },
    tags: [{ name: 'Live' }], ticket_categories: [{ price: '4500', is_closed: false }],
  };
  const second = { ...first, id: 'two', name: 'Food Fair', start: '2026-10-30T09:00:00Z', end: null, is_free: true };
  const events = [first, second, { ...first, id: 'draft', status: 'DRAFT' }];
  assert.equal(model.publicEvents(events).map(event => event.id).join(','), 'two,one');
  assert.equal(events[0].id, 'one', 'sorting must not mutate the input');
  assert.equal(model.matchEvents([first, second], ' JAZZ galle ').map(event => event.id).join(','), 'one');
  assert.equal(model.matchEvents([first], 'island live').length, 1, 'search includes organizer and tags');
  assert.equal(model.matchEvents([first], 'missing').length, 0);
  assert.equal(model.matchEvents([first, second], 'free')[0].id, 'two');
  assert.equal(model.matchEvents([{ ...first, ticket_categories: [{ price: '0' }] }], 'free').length, 1, 'zero-price tickets are searchable as free');
  assert.equal(model.matchVenues([first.venue], 'galle beach').length, 1);
  assert.equal(model.homeCard(first).price, 'From LKR 4,500');
  assert.equal(model.homeCard(second).price, 'Free');
  assert.equal(model.homeCard({ ...first, cover_image: null, feature_image: null }).img, null, 'missing images must not use sample photos');
  assert.equal(model.eventsInPeriod([first, second], 'This weekend', new Date('2026-10-28T12:00:00Z')).length, 1);
  assert.equal(model.eventsInPeriod([first], 'Today', new Date('2026-11-01T00:15:00Z')).length, 1, 'multi-day events overlap date filters');
  assert.equal(model.eventsInPeriod([first], 'Today', new Date('2026-10-28T12:00:00Z')).length, 0);
  assert.equal(model.plainDescription('<p>Hello &amp; welcome</p>'), 'Hello & welcome');
  assert.equal(model.matchEvents([{ id: 'minimal', name: 'Minimal' }], 'minimal').length, 1, 'missing optional relations are safe');

  const calls = [];
  let response = [];
  const api = load('src/lib/api/events.ts', { './client': { apiRequest: async (...args) => { calls.push(args); return response; } } });
  await api.searchEvents({ where: 'Galle & Coast', what: 'music/concerts', when: '2026-10-31' });
  assert.equal(calls.at(-1)[0], '/events/search?where=Galle%20%26%20Coast&what=music%2Fconcerts&when=2026-10-31');
  await api.searchEvents({ where: '  ' });
  assert.equal(calls.at(-1)[0], '/events/search');
  await api.getEventCategory('music/arts');
  assert.equal(calls.at(-1)[0], '/event-categories/slug/music%2Farts');
  await api.getEventVenue('venue-id');
  assert.equal(calls.at(-1)[0], '/event-venues/venue-id');
  response = { data: [first] };
  assert.equal((await api.listEvents())[0].id, 'one', 'wrapped list responses are supported');
  response = [second];
  assert.equal((await api.searchEvents())[0].id, 'two', 'bare list responses are supported');
  const designs = load('src/features/catalog/design-model.ts');
  const list = designs.listDesign([first], [{ id: 'music', name: 'Concerts', slug: 'concerts' }], [first.venue]);
  assert.equal(list.categories[0].count, '1 events', 'design card counts come from the API records');
  assert.equal(list.organisers[0].name, 'Island Music');
  assert.equal(list.organisers[0].verified, false, 'the adapter must not invent verification');
  assert.equal(list.categoryEvents[0].id, 'one', 'design links retain backend identifiers');
  assert.equal(designs.eventDesign(first).tiers[0].priceLabel, 'LKR 4,500');
  assert.equal(designs.eventDesign(first).event.fullName, first.name);
  assert.equal(designs.venueDesign({ ...first.venue, events: [first] }).venue.events[0].id, 'one');
  assert.equal(designs.listDesign([], [], []).organizer, undefined, 'empty API responses must not create sample organizers');
  assert.equal(designs.categoryIcon('Concerts'), 'music');
  console.log('Catalog tests passed: keyword matching, dates, prices, missing data, public statuses, API paths and response formats.');

  if (process.argv.includes('--live')) await liveCheck();
}

async function liveCheck() {
  const env = fs.readFileSync(path.join(root, '.env'), 'utf8');
  const base = env.match(/^EXPO_PUBLIC_API_URL\s*=\s*(.+)$/m)?.[1].trim().replace(/^['"]|['"]$/g, '').replace(/\/$/, '');
  assert.ok(base, 'EXPO_PUBLIC_API_URL must be configured');
  async function get(route) {
    const response = await fetch(`${base}${route}`, { signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200, route);
    const body = await response.json();
    console.log(`OK ${route.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/gi, ':id')}`);
    return body;
  }
  const array = body => Array.isArray(body) ? body : body.data;
  const events = array(await get('/events'));
  const categories = array(await get('/event-categories'));
  const venues = array(await get('/event-venues'));
  assert.ok(Array.isArray(array(await get('/cities'))));
  assert.ok(Array.isArray(array(await get('/events/search'))));
  if (events.length) {
    const event = await get(`/events/${encodeURIComponent(events[0].id)}`);
    assert.equal(event.id, events[0].id);
    if (event.slug) assert.equal((await get(`/events/slug/${encodeURIComponent(event.slug)}`)).id, event.id);
  }
  if (categories.length) {
    const category = await get(`/event-categories/slug/${encodeURIComponent(categories[0].slug)}`);
    const matches = array(await get(`/events/search?what=${encodeURIComponent(category.id)}`));
    assert.ok(matches.every(event => event.category_id === category.id || event.category?.id === category.id));
  }
  if (venues.length) {
    const venue = await get(`/event-venues/${encodeURIComponent(venues[0].id)}`);
    assert.equal(venue.id, venues[0].id);
    assert.ok(Array.isArray(venue.events), 'venue details include events');
  }
  console.log('Live catalog endpoint checks passed.');
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
