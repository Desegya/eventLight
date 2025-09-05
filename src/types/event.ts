export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  pricing: "free" | "paid";
  category: string;
  event_type: string;
  language: string;
  age_group: string;
  created_by: number;
  approval_status: "pending" | "approved" | "rejected";
  image: string | null;
  created_at: string;
  is_liked?: boolean;
  is_saved?: boolean;
  likes_count?: number;
  saves_count?: number;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  pricing: "free" | "paid";
  category: string;
  event_type: string;
  language: string;
  age_group: string;
  image?: File | null;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  pricing?: "free" | "paid";
  category?: string;
  event_type?: string;
  language?: string;
  age_group?: string;
  image?: File | null;
}
