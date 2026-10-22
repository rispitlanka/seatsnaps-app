import type { ImageAsset, TicketCategory, TicketTier } from "./event";

export type HoldKind = "seated" | "standing" | "mixed";
export type HoldStatus = "ACTIVE" | "CONSUMED" | "EXPIRED" | "RELEASED";
export type OrderStatus = "PENDING_PAYMENT" | "PAID" | "CANCELLED" | "EXPIRED" | "FAILED";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CHARGEDBACK";
export type OfferDiscountType = "PERCENT" | "FIXED";
export type EventOfferStatus = "ACTIVE" | "REVOKED";

export type StandingSelection = {
  ticketCategoryId: string;
  quantity: number;
};

export type CreateHoldPayload = {
  eventId: string;
  seatIds?: string[];
  standing?: StandingSelection[];
  promoCode?: string;
};

export type HoldSeat = {
  id: string;
  code?: string;
  row?: string | null;
  column?: number | null;
  ticket_category_id?: string;
  ticket_category?: {
    id: string;
    price?: string;
    discount?: string | null;
    name?: string;
  };
};

export type HoldStanding = {
  ticketCategoryId: string;
  quantity: number;
  ticketCategory?: {
    id: string;
    name?: string;
    type?: TicketTier;
    price?: string;
    discount?: string | null;
  };
};

export type HoldOffer = {
  id: string;
  promo_code?: string;
  discount_type?: OfferDiscountType;
  discount_value?: string;
  usage_limit?: number | null;
};

export type HoldPricing = {
  subtotal?: string;
  discount_total?: string;
  total?: string;
  ticketCount?: number;
};

export type Hold = {
  id: string;
  eventId: string;
  expiresAt: string;
  status: HoldStatus;
  kind?: HoldKind;
  seats?: HoldSeat[];
  standing?: HoldStanding[];
  offer?: HoldOffer | null;
  pricing?: HoldPricing | null;
};

export type FormResponseInput = {
  fieldId: string;
  value: string | number | string[];
};

export type CreateOrderPayload = {
  holdId: string;
  fullName: string;
  email: string;
  phone: string;
  promoCode?: string;
  formResponses?: FormResponseInput[];
};

export type PayHereCheckout = {
  checkout_url: string;
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  amount: string;
  currency: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  hash: string;
};

export type OrderItem = {
  id: string;
  seat_id?: string | null;
  ticket_category_id?: string;
  unit_price?: string;
  seat_code?: string | null;
  seat?: { id: string; code?: string; row?: string | null; column?: number | null } | null;
  ticket_category?: { id: string; name?: string; type?: string } | null;
};

export type OrderTicket = {
  id: string;
  reference_id: string;
  price?: string;
  check_in?: boolean;
  seat_id?: string | null;
  event_id?: string;
  ticket_category_id?: string;
  event?: {
    id: string;
    name: string;
    slug?: string | null;
    start?: string;
    end?: string | null;
    cover_image?: ImageAsset;
  };
  seat?: { id: string; code?: string; row?: string | null; column?: number | null } | null;
  ticket_category?: TicketCategory | { id: string; name?: string; type?: string; price?: string };
  order?: { id: string; order_number?: string; status?: OrderStatus };
};

export type Order = {
  id: string;
  order_number?: string;
  user_id?: string | null;
  event_id: string;
  hold_id?: string;
  status: OrderStatus;
  currency?: string;
  subtotal?: string;
  discount_total?: string;
  total?: string;
  expires_at?: string | null;
  promo_code?: string | null;
  buyer_name?: string;
  buyer_email?: string;
  buyer_phone?: string;
  items?: OrderItem[];
  tickets?: OrderTicket[];
  event?: {
    id: string;
    name?: string;
    slug?: string | null;
    start?: string;
    end?: string | null;
  } | null;
};

export type CreateOrderResponse = {
  order: Order;
  payhere: PayHereCheckout | null;
};

export type EventOffer = {
  id: string;
  promo_code: string;
  discount_value?: string;
  usage_limit?: number | null;
  status?: EventOfferStatus;
  expires_at?: string | null;
  remaining?: { value?: number; unit?: string; label?: string } | null;
  template?: {
    id: string;
    name?: string;
    discount_type?: OfferDiscountType;
    image?: ImageAsset;
  };
};
