import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import type { Hold, PayHereCheckout } from "@/types/booking";

export type BookingPreview = {
  eventId: string;
  name: string;
  when: string;
  venue: string;
  cover: string | null;
};

type BookingContextValue = {
  hold: Hold | null;
  promoCode: string;
  payhere: PayHereCheckout | null;
  eventId: string | null;
  seatIds: string[];
  /** How many seats the buyer asked for, per seated ticket category. */
  seatQty: Record<string, number>;
  standing: Record<string, number>;
  preview: BookingPreview | null;
  setHold: (hold: Hold | null) => void;
  setPromoCode: (code: string) => void;
  setPayhere: (payhere: PayHereCheckout | null) => void;
  setSeatIds: (seatIds: string[]) => void;
  setSeatQty: (ticketId: string, quantity: number) => void;
  setStandingQty: (ticketId: string, quantity: number) => void;
  prepareEvent: (eventId: string) => void;
  rememberPreview: (preview: BookingPreview) => void;
  clearSelection: () => void;
  clearBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const value = use(BookingContext);
  if (!value) {
    throw new Error("useBooking must be wrapped in a <BookingProvider />");
  }
  return value;
}

export function BookingProvider({ children }: PropsWithChildren) {
  const [hold, setHold] = useState<Hold | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [payhere, setPayhere] = useState<PayHereCheckout | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [seatIds, setSeatIds] = useState<string[]>([]);
  const [seatQty, setSeatQtyState] = useState<Record<string, number>>({});
  const [standing, setStanding] = useState<Record<string, number>>({});
  const [preview, setPreview] = useState<BookingPreview | null>(null);
  const eventIdRef = useRef<string | null>(null);

  const clearSelection = useCallback(() => {
    setSeatIds([]);
    setSeatQtyState({});
    setStanding({});
    setHold(null);
    setPromoCode("");
  }, []);

  const clearBooking = useCallback(() => {
    eventIdRef.current = null;
    setEventId(null);
    setPreview(null);
    setPayhere(null);
    clearSelection();
  }, [clearSelection]);

  const prepareEvent = useCallback((nextEventId: string) => {
    if (eventIdRef.current === nextEventId) {
      return;
    }
    eventIdRef.current = nextEventId;
    setEventId(nextEventId);
    setSeatIds([]);
    setSeatQtyState({});
    setStanding({});
    setHold(null);
    setPromoCode("");
    setPayhere(null);
  }, []);

  const setSeatQty = useCallback((ticketId: string, quantity: number) => {
    setSeatQtyState((current) => ({ ...current, [ticketId]: Math.max(0, quantity) }));
  }, []);

  const setStandingQty = useCallback((ticketId: string, quantity: number) => {
    setStanding((current) => ({ ...current, [ticketId]: Math.max(0, quantity) }));
  }, []);

  const value = useMemo(
    () => ({
      hold,
      promoCode,
      payhere,
      eventId,
      seatIds,
      seatQty,
      standing,
      preview,
      setHold,
      setPromoCode,
      setPayhere,
      setSeatIds,
      setSeatQty,
      setStandingQty,
      prepareEvent,
      rememberPreview: setPreview,
      clearSelection,
      clearBooking,
    }),
    [clearBooking, clearSelection, eventId, hold, payhere, prepareEvent, preview, promoCode, seatIds, seatQty, setSeatQty, setStandingQty, standing],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
