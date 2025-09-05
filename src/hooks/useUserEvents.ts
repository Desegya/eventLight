import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { apiService } from "../services/api";
import { Event } from "../types/event";

export const useLikedEvents = () => {
  const [likedEvents, setLikedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchLikedEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await apiService.getLikedEvents();
      setLikedEvents(events);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch liked events";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedEvents();
  }, []);

  const refetch = () => {
    fetchLikedEvents();
  };

  const removeFromLiked = (eventId: number) => {
    setLikedEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const updateEvent = (updatedEvent: Event) => {
    setLikedEvents(prev => 
      prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  return {
    likedEvents,
    loading,
    error,
    refetch,
    removeFromLiked,
    updateEvent,
  };
};

export const useSavedEvents = () => {
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchSavedEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await apiService.getSavedEvents();
      setSavedEvents(events);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch saved events";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedEvents();
  }, []);

  const refetch = () => {
    fetchSavedEvents();
  };

  const removeFromSaved = (eventId: number) => {
    setSavedEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const updateEvent = (updatedEvent: Event) => {
    setSavedEvents(prev => 
      prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  return {
    savedEvents,
    loading,
    error,
    refetch,
    removeFromSaved,
    updateEvent,
  };
};

export const useMyEvents = () => {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await apiService.getMyEvents();
      setMyEvents(events);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch your events";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const refetch = () => {
    fetchMyEvents();
  };

  const updateEvent = (updatedEvent: Event) => {
    setMyEvents(prev => 
      prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const addEvent = (newEvent: Event) => {
    setMyEvents(prev => [newEvent, ...prev]);
  };

  const removeEvent = (eventId: number) => {
    setMyEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return {
    myEvents,
    loading,
    error,
    refetch,
    updateEvent,
    addEvent,
    removeEvent,
  };
};
