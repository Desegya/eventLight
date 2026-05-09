export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  events_count: number;
  is_active: boolean;
  sort_order?: number;
}

export interface EventCreator {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  organizer?: string;
  date: string;
  end_date?: string | null;
  location: string;
  location_lat?: number | null;
  location_lng?: number | null;
  pricing: "free" | "paid";
  ticket_price?: number | null;
  category: Category;
  language: string;
  age_group: string;
  capacity?: number | null;
  rsvp_count?: number;
  is_rsvped?: boolean;
  is_full?: boolean;
  is_featured?: boolean;
  approval_status: "pending" | "approved" | "rejected";
  rejection_reason?: string | null;
  image: string | null;
  created_by: EventCreator;
  is_liked?: boolean;
  is_saved?: boolean;
  likes_count?: number;
  saves_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  organizer?: string;
  date: string;
  end_date?: string;
  location: string;
  location_lat?: number;
  location_lng?: number;
  pricing: "free" | "paid";
  ticket_price?: number | null;
  category: string;
  language: string;
  age_group: string;
  capacity?: number | null;
  image?: File | null;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  organizer?: string;
  date?: string;
  end_date?: string;
  location?: string;
  pricing?: "free" | "paid";
  ticket_price?: number | null;
  category?: string;
  language?: string;
  age_group?: string;
  capacity?: number | null;
  image?: File | null;
}

export interface EventFilters {
  search?: string;
  category?: string;
  pricing?: string;
  language?: string;
  age_group?: string;
  ordering?: string;
  page: number;
}

export interface PaginatedEvents {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

export interface Notification {
  id: number;
  type: "reminder" | "event_approved" | "event_rejected" | "new_event_nearby" | "rsvp_confirmed" | "event_cancelled";
  title: string;
  body: string;
  detail?: string;
  event?: { id: number; title: string; image: string | null } | null;
  is_read: boolean;
  created_at: string;
}

export interface PaginatedNotifications {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}
