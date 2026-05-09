import { useState, useEffect } from "react";
import { Event, CreateEventData, UpdateEventData, EventFilters } from "../types/event";
import { apiService, ApiError } from "../services/api";

export const useEvents = (filters?: Partial<EventFilters>) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters ?? {});

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getEvents(filters);
      setEvents(data.results);
      setTotalCount(data.count);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to fetch events: ${err.message}`);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  const createEvent = async (
    eventData: CreateEventData
  ): Promise<Event | null> => {
    try {
      setError(null);
      const newEvent = await apiService.createEvent(eventData);
      setEvents((prev) => [newEvent, ...prev]);
      return newEvent;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to create event: ${err.message}`);
      } else {
        setError("An unexpected error occurred");
      }
      return null;
    }
  };

  const updateEvent = async (
    id: number,
    eventData: UpdateEventData
  ): Promise<Event | null> => {
    try {
      setError(null);
      const updatedEvent = await apiService.updateEvent(id, eventData);
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? updatedEvent : event))
      );
      return updatedEvent;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to update event: ${err.message}`);
      } else {
        setError("An unexpected error occurred");
      }
      return null;
    }
  };

  const deleteEvent = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await apiService.deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to delete event: ${err.message}`);
      } else {
        setError("An unexpected error occurred");
      }
      return false;
    }
  };

  return {
    events,
    totalCount,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};

export const useEvent = (id: number) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const eventData = await apiService.getEvent(id);
        setEvent(eventData);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`Failed to fetch event: ${err.message}`);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  return { event, loading, error };
};
