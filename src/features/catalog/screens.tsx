import { useEffect, useState } from 'react';
import { Linking, Share, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  getEventById, getEventBySlug, getEventCategory, getEventVenue,
  listCities, listEventCategories, listEvents, listEventVenues, searchEvents,
} from '@/lib/api/events';
import { eventCoverUrl, formatEventWhen, formatMoney, lowestPriceLabel, mediaUrl, ticketAvailability } from '@/lib/event-display';
import { usePrefs } from '@/providers/prefs';
import { Chip, Field, PrimaryButton, Segmented, Tap } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';
import type { EventVenue } from '@/types/event';
import { CatalogImage, CatalogPage, EventCard, ResourceState, styles, VenueCard } from './components';
import { dateLabel, matchEvents, matchVenues, plainDescription, publicEvents, venueAddress } from './model';
import { useResource } from './useResource';

const allCities = 'All cities';
const location = (city: string) => city === allCities ? undefined : city;
const showResults = (q: string) => router.push({ pathname: '/results', params: { q } });
const openCategory = (slug: string) => router.push({ pathname: '/explore/category/[slug]', params: { slug } });

function CategoryChips({ categories }: { categories: Awaited<ReturnType<typeof listEventCategories>> }) {
  return <View style={styles.wrap}>{categories.map(category => <Chip key={category.id} label={category.name} onPress={() => openCategory(category.slug)} />)}</View>;
}

export function ExploreScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState(params.tab === 'Venues' || params.tab === 'Organisers' ? params.tab : 'Categories');
  const [query, setQuery] = useState('');
  useEffect(() => { if (params.tab) setTab(params.tab); }, [params.tab]);
  const resource = useResource('explore', async () => {
    const [categories, venues, events] = await Promise.all([listEventCategories(), listEventVenues(), listEvents()]);
    return { categories, venues, events: publicEvents(events) };
  });
  const data = resource.data;
  const categories = data?.categories.filter(category => category.name.toLowerCase().includes(query.trim().toLowerCase())) ?? [];
  const venues = matchVenues(data?.venues ?? [], query);
  // Organizer summaries come from actual public events, without fixture profiles/counts.
  const organizers = [...new Map((data?.events ?? []).flatMap(event => event.organization ? [[event.organization.id, event.organization] as const] : [])).values()]
    .filter(org => org.name.toLowerCase().includes(query.trim().toLowerCase()));
  const empty = tab === 'Venues' ? !venues.length : tab === 'Organisers' ? !organizers.length : !categories.length;
  return <CatalogPage title="Explore events." back={false} refresh={resource.retry} loading={resource.loading}>
    <Segmented options={['Categories', 'Organisers', 'Venues']} value={tab} onChange={setTab} />
    <Field placeholder={`Search ${tab.toLowerCase()}`} accessibilityLabel={`Search ${tab.toLowerCase()}`} value={query} onChangeText={setQuery} />
    <ResourceState {...resource} empty={!!data && empty} emptyText="No matches found." />
    {data && tab === 'Categories' ? <View style={styles.wrap}>{categories.map(category => <Tap key={category.id} accessibilityRole="button" onPress={() => openCategory(category.slug)} style={{ ...styles.card, flexBasis: '44%', flexGrow: 1 }}>
      <CatalogImage url={mediaUrl(category.icon)} label={category.name} height={95} />
      <T w={800} s={16}>{category.name}</T>
      <T color={c.muted}>{data.events.filter(event => event.category_id === category.id || event.category?.id === category.id).length} events</T>
    </Tap>)}</View> : null}
    {data && tab === 'Venues' ? venues.map(venue => <VenueCard key={venue.id} venue={venue} />) : null}
    {data && tab === 'Organisers' ? organizers.map(org => <Tap key={org.id} accessibilityRole="button" style={styles.card}
      onPress={() => router.push({ pathname: '/explore/organiser/[id]', params: { id: org.id } })}>
      <T w={800} s={17}>{org.name}</T><T color={c.muted}>{data.events.filter(event => event.organization?.id === org.id).length} events</T>
    </Tap>) : null}
  </CatalogPage>;
}

export function CategoryScreen() {
  const { slug = '' } = useLocalSearchParams<{ slug: string }>();
  const { city } = usePrefs();
  const [free, setFree] = useState(false);
  const resource = useResource(`category:${slug}:${city}`, async () => {
    const [category, events] = await Promise.all([getEventCategory(slug), searchEvents({ what: slug, where: location(city) })]);
    return { category, events: publicEvents(events) };
  });
  const events = resource.data?.events.filter(event => !free || event.is_free || lowestPriceLabel(event) === 'Free') ?? [];
  return <CatalogPage title={resource.data?.category.name ?? 'Category'} refresh={resource.retry} loading={resource.loading}>
    <Tap accessibilityRole="button" onPress={() => router.push('/city')}><T color={c.blue}>{city} ▾</T></Tap>
    <View style={styles.wrap}><Chip label="All prices" active={!free} onPress={() => setFree(false)} /><Chip label="Free" active={free} onPress={() => setFree(true)} /></View>
    <ResourceState {...resource} empty={!!resource.data && !events.length} emptyText="No events match this category and city." />
    {resource.data ? <T color={c.muted}>{events.length} events</T> : null}
    {events.map(event => <EventCard key={event.id} event={event} />)}
  </CatalogPage>;
}

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const resource = useResource('search-browse', listEventCategories);
  return <CatalogPage title="Find your next event.">
    <Field accessibilityLabel="Search events and venues" placeholder="Events, categories, venues" value={query} onChangeText={setQuery} returnKeyType="search" onSubmitEditing={() => query.trim() && showResults(query.trim())} />
    <PrimaryButton label="Search" disabled={!query.trim()} onPress={() => showResults(query.trim())} />
    <Display size={20}>Browse <Hl>categories</Hl></Display>
    <ResourceState {...resource} empty={!!resource.data && !resource.data.length} emptyText="No categories available yet." />
    {resource.data ? <CategoryChips categories={resource.data} /> : null}
    <Tap accessibilityRole="button" onPress={() => router.navigate({ pathname: '/explore', params: { tab: 'Venues' } })}><T w={800} color={c.blue}>Browse venues</T></Tap>
  </CatalogPage>;
}

export function ResultsScreen() {
  const { q = '' } = useLocalSearchParams<{ q?: string }>();
  const { city } = usePrefs();
  const [query, setQuery] = useState(q);
  const [tab, setTab] = useState('All');
  const [when, setWhen] = useState('');
  const [category, setCategory] = useState('');
  useEffect(() => setQuery(q), [q]);
  const validDate = !when || (/^\d{4}-\d{2}-\d{2}$/.test(when) && Number.isFinite(Date.parse(when)) && new Date(when).toISOString().slice(0, 10) === when);
  const resource = useResource(`results:${q}:${city}:${when}:${category}:${tab}`, async () => {
    if (!validDate && tab !== 'Venues') return null;
    const [events, venues, categories] = await Promise.all([
      searchEvents({ where: location(city), when: tab === 'Venues' ? undefined : when || undefined, what: tab === 'Venues' ? undefined : category || undefined }), listEventVenues(), listEventCategories(),
    ]);
    const visibleVenues = matchVenues(venues, location(city) ?? '');
    return { events: matchEvents(publicEvents(events), q), venues: matchVenues(visibleVenues, q), categories };
  });
  const data = resource.data;
  const empty = !!data && (tab === 'Events' ? !data.events.length : tab === 'Venues' ? !data.venues.length : !data.events.length && !data.venues.length);
  return <CatalogPage title="Search results." refresh={resource.retry} loading={resource.loading}>
    <Field accessibilityLabel="Search events and venues" value={query} onChangeText={setQuery} placeholder="Search events and venues" returnKeyType="search"
      onSubmitEditing={() => router.setParams({ q: query.trim() })} />
    <PrimaryButton label="Search" onPress={() => router.setParams({ q: query.trim() })} />
    <Tap accessibilityRole="button" onPress={() => router.push('/city')}><T color={c.blue}>{city} ▾</T></Tap>
    <Segmented options={['All', 'Events', 'Venues']} value={tab} onChange={setTab} />
    {tab !== 'Venues' ? <>
      <Field label="Event date (YYYY-MM-DD)" placeholder="Any date" accessibilityLabel="Event date, YYYY-MM-DD" value={when} onChangeText={setWhen} autoCapitalize="none" />
      {!validDate ? <T accessibilityRole="alert" color={c.danger}>Enter a valid date using YYYY-MM-DD, or clear it for any date.</T> : null}
      <View style={styles.wrap}><Chip label="All categories" active={!category} onPress={() => setCategory('')} />{data?.categories.map(item => <Chip key={item.id} label={item.name} active={category === item.slug} onPress={() => setCategory(item.slug)} />)}</View>
    </> : null}
    {validDate || tab === 'Venues' ? <ResourceState {...resource} empty={empty} emptyText={`No results${q ? ` for “${q}”` : ''}. Try another word, city, or event filter.`} /> : null}
    {data && tab !== 'Venues' ? <View style={styles.section}><T w={800}>{data.events.length} events</T>{data.events.map(event => <EventCard key={event.id} event={event} />)}</View> : null}
    {data && tab !== 'Events' ? <View style={styles.section}><T w={800}>{data.venues.length} venues</T>{data.venues.map(venue => <VenueCard key={venue.id} venue={venue} />)}</View> : null}
  </CatalogPage>;
}

function Directions({ venue }: { venue: EventVenue }) {
  const coordinates = venue.coordinate;
  const destination = coordinates?.lat != null && coordinates?.lng != null
    ? `${coordinates.lat},${coordinates.lng}` : [venue.name, venueAddress(venue)].filter(Boolean).join(', ');
  const [error, setError] = useState('');
  return <View style={styles.section}><PrimaryButton label="Get directions" onPress={() => {
    setError('');
    void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`)
      .catch(() => setError('Could not open Maps. Please try again.'));
  }} />{error ? <T accessibilityRole="alert" color={c.danger}>{error}</T> : null}</View>;
}

export function VenueScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const resource = useResource(`venue:${id}`, () => getEventVenue(id));
  const venue = resource.data;
  return <CatalogPage title={venue?.name ?? 'Venue'} refresh={resource.retry} loading={resource.loading}>
    <ResourceState {...resource} />
    {venue ? <>
      <CatalogImage url={mediaUrl(venue.images?.[0])} label={venue.name} height={240} />
      <T s={15} color={c.muted}>{venueAddress(venue) || 'Location to be announced'}</T>
      <Directions venue={venue} />
      {venue.description ? <View style={styles.card}><Display size={20}>About the venue</Display><T lh={1.6}>{plainDescription(venue.description)}</T></View> : null}
      {venue.venue_features?.length ? <View style={styles.card}><Display size={20}>Facilities</Display>{venue.venue_features.map(item => <T key={item.feature.id}>{item.feature.name}</T>)}</View> : null}
      {(venue.images ?? []).slice(1).map((image, index) => <CatalogImage key={index} url={mediaUrl(image)} label={venue.name} />)}
      <Display size={20}>What's <Hl>on here</Hl></Display>
      <ResourceState loading={false} retry={resource.retry} empty={!venue.events?.length} emptyText="No published events at this venue yet." />
      {publicEvents(venue.events ?? []).map(event => <EventCard key={event.id} event={event} />)}
    </> : null}
  </CatalogPage>;
}

export function EventScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const resource = useResource(`event:${id}`, () => /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id) ? getEventById(id) : getEventBySlug(id));
  const event = resource.data;
  const venue = event?.venue;
  return <CatalogPage title={event?.name ?? 'Event'} refresh={resource.retry} loading={resource.loading}>
    <ResourceState {...resource} />
    {event ? <>
      <CatalogImage url={eventCoverUrl(event)} label={event.name} height={280} />
      {event.category ? <Chip label={event.category.name} onPress={() => openCategory(event.category!.slug)} /> : null}
      <T w={800} s={18}>{formatEventWhen(event.start, event.end)}</T>
      {event.organization ? <Tap accessibilityRole="button" onPress={() => router.push({ pathname: '/explore/organiser/[id]', params: { id: event.organization!.id } })}><T color={c.blue}>By {event.organization.name}</T></Tap> : null}
      {venue ? <View style={styles.card}>
        <Tap accessibilityRole="button" onPress={() => router.push({ pathname: '/explore/venue/[id]', params: { id: venue.id } })}><T w={800} s={17}>{venue.name}</T><T color={c.muted}>{venueAddress(venue)}</T></Tap>
        <Directions venue={venue} />
      </View> : null}
      <View style={styles.card}><Display size={20}>About the event</Display><T lh={1.6}>{plainDescription(event.description) || 'More details will be announced by the organiser.'}</T></View>
      <View style={styles.wrap}>{event.tags?.map(tag => <Chip key={tag.id} label={tag.name} onPress={() => showResults(tag.name)} />)}</View>
      {event.sessions?.length ? <View style={styles.card}><Display size={20}>Shows & dates</Display>{event.sessions.map(session => <View key={session.id} style={styles.section}>
        <T w={800}>{session.label || dateLabel(session.start)}</T><T>{formatEventWhen(session.start, session.end)}</T>
        {session.venue ? <Tap accessibilityRole="button" onPress={() => router.push({ pathname: '/explore/venue/[id]', params: { id: session.venue!.id } })}><T color={c.blue}>{session.venue.name}</T></Tap> : null}
        {session.status === 'CANCELLED' ? <T color={c.danger}>Cancelled</T> : null}
      </View>)}</View> : null}
      <View style={styles.card}><Display size={20}>Tickets</Display>
        <T w={800} s={18} color={c.blue}>{lowestPriceLabel(event) ?? 'Pricing to be announced'}</T>
        {event.ticket_categories?.map(ticket => {
          const available = ticketAvailability(ticket);
          return <View key={ticket.id} style={styles.row}><View style={{ flex: 1, gap: 4 }}><T w={800}>{ticket.name}</T><T color={c.muted}>{ticket.is_closed ? 'Closed' : available === null ? 'Availability to be confirmed' : `${available} available`}</T></View><T w={800}>{formatMoney(ticket.price) ?? 'Price unavailable'}</T></View>;
        })}
        <T color={c.muted}>Ticket purchasing is not connected in this version.</T>
      </View>
      {event.sub_events?.length ? <View style={styles.section}><Display size={20}>Related events</Display>{publicEvents(event.sub_events).map(child => <EventCard key={child.id} event={child} />)}</View> : null}
      <PrimaryButton label="Share event" onPress={() => { void Share.share({ message: `${event.name} · ${formatEventWhen(event.start, event.end)}` }).catch(() => {}); }} />
    </> : null}
  </CatalogPage>;
}

export function CityScreen() {
  const { city, setCity } = usePrefs();
  const [query, setQuery] = useState('');
  const resource = useResource('cities', listCities);
  const select = (name: string) => { setCity(name); router.back(); };
  const cities = resource.data?.filter(item => item.name.toLowerCase().includes(query.trim().toLowerCase())) ?? [];
  return <CatalogPage title="Choose your city.">
    <Field accessibilityLabel="Search cities" placeholder="Search cities" value={query} onChangeText={setQuery} />
    <Chip label={allCities} active={city === allCities} onPress={() => select(allCities)} />
    <ResourceState {...resource} empty={!!resource.data && !cities.length} emptyText="No matching cities." />
    {cities.map(item => <Tap key={item.id} accessibilityRole="button" accessibilityState={{ selected: item.name === city }} style={styles.card} onPress={() => select(item.name)}><T w={800} color={item.name === city ? c.blue : c.ink}>{item.name}</T></Tap>)}
  </CatalogPage>;
}

export function OrganizerScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const resource = useResource(`organizer:${id}`, async () => {
    const events = publicEvents(await listEvents()).filter(event => event.organization?.id === id || event.org_id === id);
    return { events, organization: events.find(event => event.organization)?.organization };
  });
  return <CatalogPage title={resource.data?.organization?.name ?? 'Organiser'} refresh={resource.retry} loading={resource.loading}>
    <ResourceState {...resource} empty={!!resource.data && !resource.data.events.length} emptyText="No published events from this organiser." />
    {resource.data?.organization?.description ? <T lh={1.6}>{plainDescription(resource.data.organization.description)}</T> : null}
    {resource.data?.events.map(event => <EventCard key={event.id} event={event} />)}
  </CatalogPage>;
}
