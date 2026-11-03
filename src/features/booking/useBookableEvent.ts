import { useCallback, useEffect, useRef, useState } from "react";

import { getEventById, getEventBySlug } from "@/lib/api/events";
import { toErrorMessage } from "@/lib/api/errors";
import { eventCoverUrl, formatEventWhen } from "@/lib/event-display";
import { useBooking } from "@/providers/booking";
import type { Event } from "@/types/event";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function loadBookableEvent(idOrSlug: string) {
  if (UUID.test(idOrSlug)) {
    try {
      return await getEventById(idOrSlug);
    } catch {
      return getEventBySlug(idOrSlug);
    }
  }
  try {
    return await getEventBySlug(idOrSlug);
  } catch {
    return getEventById(idOrSlug);
  }
}

export function useBookableEvent(id?: string) {
  const { prepareEvent, rememberPreview } = useBooking();
  const prepareRef = useRef(prepareEvent);
  const rememberRef = useRef(rememberPreview);
  prepareRef.current = prepareEvent;
  rememberRef.current = rememberPreview;
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  const reload = useCallback(async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const next = await loadBookableEvent(id);
      prepareRef.current(next.id);
      rememberRef.current({
        eventId: next.id,
        name: next.name,
        when: formatEventWhen(next.start, next.end),
        venue: next.venue?.name ?? "Venue to be announced",
        cover: eventCoverUrl(next),
      });
      setEvent(next);
    } catch (caught) {
      setEvent(null);
      setError(toErrorMessage(caught, "Could not load this event."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { event, error, loading, reload };
}
