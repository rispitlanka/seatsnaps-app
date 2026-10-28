import { useEffect, useState } from 'react';
import ExploreView from './views/ExploreView';
import CategoryView from './views/CategoryView';
import SearchView from './views/SearchView';
import EventView from './views/EventView';
import VenueView from './views/VenueView';
import OrganizerView from './views/OrganizerView';
import CityView from './views/CityView';
import ResultsView from './views/ResultsView';
import { listDesign, eventDesign, venueDesign, organizerDesign, eventRow } from './design-model';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  getEventById, getEventBySlug, getEventCategory, getEventVenue,
  listCities, listEventCategories, listEvents, listEventVenues, searchEvents,
} from '@/lib/api/events';
import { usePrefs } from '@/providers/prefs';
import { Chip, Field, PrimaryButton } from '@/ui/components';
import { T } from '@/ui/Text';
import { c } from '@/ui/tokens';
import { CatalogPage, ResourceState, styles } from './components';
import { matchEvents, matchVenues, publicEvents } from './model';
import { useResource } from './useResource';

const allCities = 'All cities';
const location = (city: string) => city === allCities ? undefined : city;
export function ExploreScreen() {
  const resource = useResource('explore', async () => {
    const [categories, venues, events] = await Promise.all([listEventCategories(), listEventVenues(), listEvents()]);
    return listDesign(publicEvents(events), categories, venues);
  });
  return resource.data ? <ExploreView model={resource.data} /> : <CatalogPage title="Explore events." back={false}><ResourceState {...resource} /></CatalogPage>;
}

export function CategoryScreen() {
  const { slug = '' } = useLocalSearchParams<{ slug: string }>();
  const { city } = usePrefs();
  const resource = useResource(`category:${slug}:${city}`, async () => {
    const [category, events] = await Promise.all([getEventCategory(slug), searchEvents({ what: slug, where: location(city) })]);
    return listDesign(publicEvents(events), [category], []);
  });
  return resource.data ? <CategoryView model={resource.data} city={city} /> : <CatalogPage title="Category"><ResourceState {...resource} /></CatalogPage>;
}

export function SearchScreen() {
  const resource = useResource('search-browse', async () => {
    const [categories, events] = await Promise.all([listEventCategories(), listEvents()]);
    return listDesign(publicEvents(events), categories, []);
  });
  return resource.data ? <SearchView model={resource.data} /> : <CatalogPage title="Search"><ResourceState {...resource} /></CatalogPage>;
}

export function ResultsScreen() {
  const { q = '' } = useLocalSearchParams<{ q?: string }>();
  const { city } = usePrefs();
  const [query, setQuery] = useState(q);
  const [when, setWhen] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [category, setCategory] = useState('');
  useEffect(() => setQuery(q), [q]);
  const validDate = !when || (/^\d{4}-\d{2}-\d{2}$/.test(when) && Number.isFinite(Date.parse(when)) && new Date(when).toISOString().slice(0, 10) === when);
  const resource = useResource(`results:${q}:${city}:${dateFilter}:${category}`, async () => {
    const [events, venues, categories] = await Promise.all([
      searchEvents({ where: location(city), when: dateFilter || undefined, what: category || undefined }), listEventVenues(), listEventCategories(),
    ]);
    const visibleVenues = matchVenues(venues, location(city) ?? '');
    return { events: matchEvents(publicEvents(events), q), venues: matchVenues(visibleVenues, q), categories, allEvents: publicEvents(events) };
  });
  const data = resource.data;

  if (!data) return <CatalogPage title="Search results."><ResourceState {...resource} /></CatalogPage>;
  const model = listDesign(data.events, data.categories, data.venues);
  model.categoryEvents = data.allEvents.map(eventRow);
  return <ResultsView model={model} q={q} filters={<View style={{ gap: 12 }}>
    <View style={{ flexDirection: 'row', gap: 8 }}><View style={{ flex: 1 }}><Field accessibilityLabel="Search events and venues" value={query} onChangeText={setQuery} placeholder="Search events and venues" returnKeyType="search" onSubmitEditing={() => router.setParams({ q: query.trim() })} /></View><PrimaryButton label="Search" onPress={() => router.setParams({ q: query.trim() })} /></View>
    <View style={styles.wrap}><Chip label={city} icon="pin" onPress={() => router.push('/city')} /><Chip label="All categories" active={!category} onPress={() => setCategory('')} />{data.categories.map(item => <Chip key={item.id} label={item.name} active={category === item.slug} onPress={() => setCategory(item.slug)} />)}</View>
    <Field label="Event date (YYYY-MM-DD)" placeholder="Any date" accessibilityLabel="Event date, YYYY-MM-DD" value={when} onChangeText={setWhen} />
    {!validDate ? <T color={c.danger}>Enter a valid date using YYYY-MM-DD.</T> : null}
    <PrimaryButton label="Apply date" disabled={!validDate} onPress={() => setDateFilter(when)} />
  </View>} />;
}

export function VenueScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const resource = useResource(`venue:${id}`, () => getEventVenue(id));
  return resource.data ? <VenueView model={venueDesign(resource.data)} /> : <CatalogPage title="Venue"><ResourceState {...resource} /></CatalogPage>;
}

export function EventScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const resource = useResource(`event:${id}`, () => /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id) ? getEventById(id) : getEventBySlug(id));
  return resource.data ? <EventView model={eventDesign(resource.data, resource.data.sub_events)} /> : <CatalogPage title="Event"><ResourceState {...resource} /></CatalogPage>;
}

export function CityScreen() {
  const resource = useResource('cities', listCities);
  return resource.data ? <CityView cities={[[allCities, 'Discover all locations'], ...resource.data.map(city => [city.name, city.description || 'Browse events'])]} /> : <CatalogPage title="Choose your city."><ResourceState {...resource} /></CatalogPage>;
}

export function OrganizerScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const resource = useResource(`organizer:${id}`, async () => {
    const events = publicEvents(await listEvents()).filter(event => event.organization?.id === id || event.org_id === id);
    return organizerDesign(events.find(event => event.organization)?.organization, events);
  });
  return resource.data ? <OrganizerView model={resource.data} /> : <CatalogPage title="Organiser"><ResourceState {...resource} /></CatalogPage>;
}
