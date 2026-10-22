import type {
  City,
  Event,
  EventCategory,
  EventSession,
  EventTag,
  EventVenue,
} from "@/types/event";
import { apiRequest } from "./client";

export function asArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  if (payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: T[] }).data;
  }
  return [];
}

export async function listEvents() {
  const payload = await apiRequest<unknown>("/events");
  return asArray<Event>(payload);
}

export function getEventById(id: string) {
  return apiRequest<Event>(`/events/${id}`, { errorContext: "event" });
}

export function getEventBySlug(slug: string) {
  return apiRequest<Event>(`/events/slug/${slug}`, { errorContext: "event" });
}

export async function listEventSessions(eventId: string) {
  const payload = await apiRequest<unknown>(`/events/${eventId}/sessions`, {
    errorContext: "event",
  });
  return asArray<EventSession>(payload);
}

export async function listEventCategories() {
  const payload = await apiRequest<unknown>("/event-categories");
  return asArray<EventCategory>(payload).filter(
    (item) => item.is_active !== false && item.status !== "REJECTED",
  );
}

export async function listEventTags() {
  const payload = await apiRequest<unknown>("/event-tags");
  return asArray<EventTag>(payload).filter(
    (item) => item.is_active !== false && item.status !== "REJECTED",
  );
}

export async function listCities() {
  const payload = await apiRequest<unknown>("/cities");
  return asArray<City>(payload).filter(
    (item) => item.is_active !== false && item.status !== "REJECTED",
  );
}

export async function listEventVenues() {
  const payload = await apiRequest<unknown>("/event-venues");
  return asArray<EventVenue>(payload).filter(
    (item) => item.is_active !== false && item.status !== "REJECTED",
  );
}
