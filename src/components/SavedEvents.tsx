import {
  Box,
  Heading,
  Button,
  Text,
  useToast,
  SimpleGrid,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import { useSavedEvents } from "../hooks/useUserEvents";
import { useEventInteractions } from "../hooks/useEventInteractions";
import { Event } from "../types/event";

const SavedEvents = () => {
  const { savedEvents, loading } = useSavedEvents();
  const { toggleSave } = useEventInteractions();
  const toast = useToast();
  const navigate = useNavigate();

  const handleUnsaveEvent = async (event: Event) => {
    try {
      await toggleSave(event);
      toast({
        title: "Event Unsaved",
        description: "Event removed from your saved list",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleRemoveEvent = (event: Event) => {
    handleUnsaveEvent(event);
  };

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Box p={4} alignSelf="center" justifySelf="center">
      <Heading size="md" mb={6}>
        Saved Events
      </Heading>

      {savedEvents.length > 0 ? (
        <SimpleGrid spacing={6} columns={{ base: 1, md: 2 }}>
          {savedEvents.map((event) => (
            <Box key={event.id}>
              <EventCard
                event={event}
                onEventUpdate={() => {
                  // Event updates are handled by the hook itself
                  // This callback is mainly for refreshing data if needed
                }}
              />
              <Button
                mt={2}
                size="sm"
                colorScheme="red"
                onClick={() => handleRemoveEvent(event)}
              >
                Unsave Event
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="xl" mb={4}>
            You have no saved events yet.
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => navigate("/")} // Redirect to the events listing page
          >
            Discover Events
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SavedEvents;
