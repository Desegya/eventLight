import { Event, CreateEventData, UpdateEventData } from "../types/event";

const API_BASE_URL = "http://localhost:8000/api";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiService {
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem("authToken");

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, "Network error or server unavailable");
    }
  }

  private async requestWithFormData(
    endpoint: string,
    formData: FormData,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem("authToken");

    const config: RequestInit = {
      ...options,
      headers: {
        ...(token && { Authorization: `Token ${token}` }),
        ...options.headers,
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, "Network error or server unavailable");
    }
  }

  // Event endpoints
  async getEvents(): Promise<Event[]> {
    return this.request("/events/");
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    if (eventData.image) {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("description", eventData.description);
      formData.append("date", eventData.date);
      formData.append("location", eventData.location);
      formData.append("pricing", eventData.pricing);
      formData.append("category", eventData.category);
      formData.append("event_type", eventData.event_type);
      formData.append("language", eventData.language);
      formData.append("age_group", eventData.age_group);
      formData.append("image", eventData.image);

      return this.requestWithFormData("/events/", formData, {
        method: "POST",
      });
    } else {
      const { image, ...dataWithoutImage } = eventData;
      return this.request("/events/", {
        method: "POST",
        body: JSON.stringify(dataWithoutImage),
      });
    }
  }

  async getEvent(id: number): Promise<Event> {
    return this.request(`/events/${id}/`);
  }

  async updateEvent(id: number, eventData: UpdateEventData): Promise<Event> {
    if (eventData.image) {
      const formData = new FormData();
      Object.entries(eventData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      return this.requestWithFormData(`/events/${id}/`, formData, {
        method: "PUT",
      });
    } else {
      const { image, ...dataWithoutImage } = eventData;
      return this.request(`/events/${id}/`, {
        method: "PUT",
        body: JSON.stringify(dataWithoutImage),
      });
    }
  }

  async deleteEvent(id: number): Promise<void> {
    return this.request(`/events/${id}/`, {
      method: "DELETE",
    });
  }

  // Like/Unlike event
  async toggleLikeEvent(
    eventId: number
  ): Promise<{ message: string; liked: boolean }> {
    return this.request(`/events/${eventId}/like/`, {
      method: "POST",
    });
  }

  // Save/Unsave event
  async toggleSaveEvent(
    eventId: number
  ): Promise<{ message: string; saved: boolean }> {
    return this.request(`/events/${eventId}/save/`, {
      method: "POST",
    });
  }

  // Get user's liked events
  async getLikedEvents(): Promise<Event[]> {
    return this.request("/events/liked/");
  }

  // Get user's saved events
  async getSavedEvents(): Promise<Event[]> {
    return this.request("/events/saved/");
  }

  // Get user's created events
  async getMyEvents(): Promise<Event[]> {
    return this.request("/events/my-events/");
  }
}

export const apiService = new ApiService();
export { ApiError };
