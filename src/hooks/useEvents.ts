import { useState, useEffect } from "react";
import { Event, CreateEventData, UpdateEventData } from "../types/event";
import { apiService, ApiError } from "../services/api";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventsData = await apiService.getEvents();
      setEvents(eventsData);
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
  }, []);

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
