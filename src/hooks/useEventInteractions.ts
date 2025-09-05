import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { apiService } from "../services/api";
import { Event } from "../types/event";

export const useEventInteractions = () => {
  const [loading, setLoading] = useState<{
    [key: number]: { like: boolean; save: boolean };
  }>({});
  const toast = useToast();

  const toggleLike = async (
    event: Event,
    onUpdate?: (updatedEvent: Event) => void
  ) => {
    const eventId = event.id;

    // Set loading state for this specific event
    setLoading((prev) => ({
      ...prev,
      [eventId]: { ...prev[eventId], like: true },
    }));

    try {
      const response = await apiService.toggleLikeEvent(eventId);

      // Update the event object
      const updatedEvent = { ...event, is_liked: response.liked };

      // Call the update callback if provided
      if (onUpdate) {
        onUpdate(updatedEvent);
      }

      toast({
        title: response.liked ? "Event Liked!" : "Event Unliked",
        description: response.message,
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      return updatedEvent;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update like status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      throw error;
    } finally {
      // Clear loading state
      setLoading((prev) => ({
        ...prev,
        [eventId]: { ...prev[eventId], like: false },
      }));
    }
  };

  const toggleSave = async (
    event: Event,
    onUpdate?: (updatedEvent: Event) => void
  ) => {
    const eventId = event.id;

    // Set loading state for this specific event
    setLoading((prev) => ({
      ...prev,
      [eventId]: { ...prev[eventId], save: true },
    }));

    try {
      const response = await apiService.toggleSaveEvent(eventId);

      // Update the event object
      const updatedEvent = { ...event, is_saved: response.saved };

      // Call the update callback if provided
      if (onUpdate) {
        onUpdate(updatedEvent);
      }

      toast({
        title: response.saved ? "Event Saved!" : "Event Unsaved",
        description: response.message,
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      return updatedEvent;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update save status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      throw error;
    } finally {
      // Clear loading state
      setLoading((prev) => ({
        ...prev,
        [eventId]: { ...prev[eventId], save: false },
      }));
    }
  };

  const isLikeLoading = (eventId: number) => loading[eventId]?.like || false;
  const isSaveLoading = (eventId: number) => loading[eventId]?.save || false;

  return {
    toggleLike,
    toggleSave,
    isLikeLoading,
    isSaveLoading,
  };
};
