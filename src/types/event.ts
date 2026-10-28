export type ImageAsset = {
  url?: string;
  publicId?: string;
  name?: string;
} | null;

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type EventStatus = "DRAFT" | "PUBLISHED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type EventSessionStatus = "SCHEDULED" | "CANCELLED";
export type ZoneType = "SEATED" | "STANDING" | "TABLE";
export type LayoutType = "GRID" | "CANVAS";
export type TicketTier = "REGULAR" | "EARLY_BIRD";
export type Coordinate = {
  lat?: number;
  lng?: number;
};

export type EventCategory = {
  id: string;
  name: string;
  slug: string;
  icon?: ImageAsset;
  is_active?: boolean;
  status?: ApprovalStatus;
};

export type EventTag = {
  id: string;
  name: string;
  slug: string;
  is_active?: boolean;
  status?: ApprovalStatus;
};

export type City = {
  id: string;
  name: string;
  image?: ImageAsset;
  description?: string | null;
  location?: string | null;
  coordinate?: Coordinate | null;
  is_active?: boolean;
  status?: ApprovalStatus;
};

export type EventVenue = {
  id: string;
  slug?: string | null;
  name: string;
  location?: string | null;
  coordinate?: Coordinate | null;
  city?: string | null;
  address?: string | null;
  images?: ImageAsset[];
  is_seat?: boolean;
  is_active?: boolean;
  status?: ApprovalStatus;
  city_id?: string | null;
  venue_city?: City | null;
  description?: string | null;
  venue_features?: { feature: { id: string; name: string } }[];
  events?: Event[];
};

export type OrganizationSummary = {
  id: string;
  slug?: string | null;
  name: string;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  org_image?: ImageAsset;
  website?: string | null;
};

export type EventSession = {
  id: string;
  event_id?: string;
  start: string;
  end?: string | null;
  label?: string | null;
  venue_id?: string | null;
  status?: EventSessionStatus;
  venue?: EventVenue | null;
};

export type TicketCategory = {
  id: string;
  zone_id?: string | null;
  event_id?: string;
  name: string;
  type?: TicketTier;
  price: string;
  discount?: string | null;
  image?: ImageAsset;
  total_quantity?: number | null;
  sold_quantity?: number | null;
  held_quantity?: number | null;
  close_date?: string | null;
  is_closed?: boolean;
};

export type SeatStatus = "AVAILABLE" | "HELD" | "BOOKED" | "BLOCKED" | "DISABLED";
export type SeatType = "NORMAL" | "VIP" | "ACCESSIBLE" | "COMPANION" | "BLOCKED";
export type BookingFormFieldType =
  | "TEXT"
  | "NUMBER"
  | "PHONE"
  | "EMAIL"
  | "DROPDOWN"
  | "SINGLE_CHOICE"
  | "CHECKBOX"
  | "IMAGE";

export type EventSeat = {
  id: string;
  zone_id?: string;
  ticket_category_id?: string | null;
  code: string;
  row?: string | null;
  column?: number | null;
  status: SeatStatus;
  seat_type?: SeatType;
  layout?: {
    x?: number;
    y?: number;
    rotation?: number;
    scale?: number;
  } | null;
};

export type CanvasObject = {
  id: string;
  zone_id?: string | null;
  object_type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  properties?: Record<string, unknown> | null;
};

export type ZoneTable = {
  id: string;
  name?: string | null;
  shape?: string | null;
  capacity?: number | null;
  x: number;
  y: number;
  rotation?: number;
};

export type EventLayout = {
  id?: string;
  layout_type?: LayoutType;
  canvas_width?: number | null;
  canvas_height?: number | null;
  background_image?: ImageAsset;
  canvas_objects?: CanvasObject[];
};

export type BookingFormField = {
  id: string;
  event_id?: string;
  name: string;
  type: BookingFormFieldType | string;
  required?: boolean;
  sort_order?: number;
  options?: unknown[];
  image?: ImageAsset;
};

export type EventZone = {
  id: string;
  name: string;
  color?: string | null;
  capacity?: number | null;
  is_seated?: boolean;
  type?: ZoneType;
  seat_type?: LayoutType;
  canvas_width?: number | null;
  canvas_height?: number | null;
  seat_spacing_x?: number | null;
  seat_spacing_y?: number | null;
  canvas_objects?: CanvasObject[];
  tables?: ZoneTable[];
  seats?: EventSeat[];
};

export type ParentEvent = {
  id: string;
  name: string;
  slug?: string | null;
  status?: EventStatus;
};

export type Event = {
  id: string;
  slug?: string | null;
  name: string;
  description?: string | null;
  start: string;
  end?: string | null;
  cover_image?: ImageAsset;
  feature_image?: ImageAsset;
  images?: ImageAsset[];
  contact_email?: string | null;
  contact_phone?: string | null;
  trailer?: string | null;
  is_featured?: boolean;
  is_free?: boolean;
  registration_open?: string | null;
  registration_close?: string | null;
  ticket_limit?: number | null;
  status: EventStatus;
  org_id?: string;
  category_id?: string | null;
  venue_id?: string | null;
  parent_event_id?: string | null;
  organization?: OrganizationSummary | null;
  category?: EventCategory | null;
  venue?: EventVenue | null;
  tags?: EventTag[];
  parent_event?: ParentEvent | null;
  sub_events?: Event[];
  sessions?: EventSession[];
  ticket_categories?: TicketCategory[];
  booking_form_fields?: BookingFormField[];
  zones?: EventZone[];
  layout?: EventLayout | null;
};
