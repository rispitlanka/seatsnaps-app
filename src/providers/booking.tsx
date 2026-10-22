import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import type { Hold, PayHereCheckout } from "@/types/booking";

type BookingContextValue = {
  hold: Hold | null;
  promoCode: string;
  payhere: PayHereCheckout | null;
  setHold: (hold: Hold | null) => void;
  setPromoCode: (code: string) => void;
  setPayhere: (payhere: PayHereCheckout | null) => void;
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

  const clearBooking = useCallback(() => {
    setHold(null);
    setPromoCode("");
    setPayhere(null);
  }, []);

  const value = useMemo(
    () => ({
      hold,
      promoCode,
      payhere,
      setHold,
      setPromoCode,
      setPayhere,
      clearBooking,
    }),
    [clearBooking, hold, payhere, promoCode],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
