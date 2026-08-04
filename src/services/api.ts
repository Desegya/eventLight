import {
  Event,
  Category,
  PaginatedNotifications,
  CreateEventData,
  UpdateEventData,
  EventFilters,
  PaginatedEvents,
} from "../types/event";
import { ensureCsrfCookie, csrfHeader } from "./csrf";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    await ensureCsrfCookie();
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...csrfHeader(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorDetail = `HTTP error! status: ${response.status}`;
        try {
          const body = await response.json();
          errorDetail = body.detail || JSON.stringify(body);
        } catch {}
        throw new ApiError(response.status, errorDetail);
      }

      if (response.status === 204) return undefined;
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, "Network error or server unavailable");
    }
  }

  private async requestWithFormData(
    endpoint: string,
    formData: FormData,
    options: RequestInit = {}
  ): Promise<any> {
    await ensureCsrfCookie();
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      credentials: "include",
      headers: {
        ...csrfHeader(),
        ...options.headers,
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorDetail = `HTTP error! status: ${response.status}`;
        try {
          const body = await response.json();
          errorDetail = body.detail || JSON.stringify(body);
        } catch {}
        throw new ApiError(response.status, errorDetail);
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, "Network error or server unavailable");
    }
  }

  // ── Categories ──────────────────────────────────────────────────────────────

  async getCategories(): Promise<Category[]> {
    return this.request("/categories/");
  }

  // ── Events ───────────────────────────────────────────────────────────────────

  async getEvents(filters?: Partial<EventFilters>): Promise<PaginatedEvents> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString();
    return this.request(`/events/${query ? "?" + query : ""}`);
  }

  async getEvent(id: number): Promise<Event> {
    return this.request(`/events/${id}/`);
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    if (eventData.image) {
      const formData = new FormData();
      const append = (key: string, val: unknown) => {
        if (val !== undefined && val !== null) formData.append(key, String(val));
      };
      formData.append("title", eventData.title);
      formData.append("description", eventData.description);
      formData.append("date", eventData.date);
      formData.append("location", eventData.location);
      formData.append("pricing", eventData.pricing);
      formData.append("category", eventData.category);
      formData.append("language", eventData.language);
      formData.append("age_group", eventData.age_group);
      formData.append("image", eventData.image);
      append("organizer", eventData.organizer);
      append("end_date", eventData.end_date);
      append("location_lat", eventData.location_lat);
      append("location_lng", eventData.location_lng);
      append("ticket_price", eventData.ticket_price);
      append("capacity", eventData.capacity);
      return this.requestWithFormData("/events/", formData, { method: "POST" });
    } else {
      const { image, ...rest } = eventData;
      return this.request("/events/", {
        method: "POST",
        body: JSON.stringify(rest),
      });
    }
  }

  async updateEvent(id: number, eventData: UpdateEventData): Promise<Event> {
    if (eventData.image) {
      const formData = new FormData();
      Object.entries(eventData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) formData.append(key, value);
          else formData.append(key, String(value));
        }
      });
      return this.requestWithFormData(`/events/${id}/`, formData, { method: "PATCH" });
    } else {
      const { image, ...rest } = eventData;
      return this.request(`/events/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(rest),
      });
    }
  }

  async deleteEvent(id: number): Promise<void> {
    return this.request(`/events/${id}/`, { method: "DELETE" });
  }

  async getRelatedEvents(id: number): Promise<PaginatedEvents> {
    return this.request(`/events/${id}/related/`);
  }

  // ── Like / Save / RSVP ──────────────────────────────────────────────────────

  async toggleLikeEvent(eventId: number): Promise<{ liked: boolean; likes_count: number; message: string }> {
    return this.request(`/events/${eventId}/like/`, { method: "POST" });
  }

  async toggleSaveEvent(eventId: number): Promise<{ saved: boolean; saves_count: number; message: string }> {
    return this.request(`/events/${eventId}/save/`, { method: "POST" });
  }

  async toggleRsvp(eventId: number): Promise<{ rsvped: boolean; rsvp_count: number; message: string }> {
    return this.request(`/events/${eventId}/rsvp/`, { method: "POST" });
  }

  // ── Personal collections ─────────────────────────────────────────────────────

  async getLikedEvents(): Promise<Event[]> {
    return this.request("/events/liked/");
  }

  async getSavedEvents(): Promise<Event[]> {
    return this.request("/events/saved/");
  }

  async getMyEvents(): Promise<Event[]> {
    return this.request("/events/my-events/");
  }

  async getAttendingEvents(): Promise<Event[]> {
    return this.request("/events/attending/");
  }

  // ── Notifications ────────────────────────────────────────────────────────────

  async getNotifications(page = 1): Promise<PaginatedNotifications> {
    return this.request(`/notifications/?page=${page}`);
  }

  async getUnreadNotificationCount(): Promise<{ count: number }> {
    return this.request("/notifications/unread-count/");
  }

  async markNotificationRead(id: number): Promise<void> {
    return this.request(`/notifications/${id}/read/`, { method: "POST" });
  }

  async markAllNotificationsRead(): Promise<{ updated: number }> {
    return this.request("/notifications/read-all/", { method: "POST" });
  }

  async deleteNotification(id: number): Promise<void> {
    return this.request(`/notifications/${id}/`, { method: "DELETE" });
  }
}

export const apiService = new ApiService();
export { ApiError };
