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
import { useLikedEvents } from "../hooks/useUserEvents";
import { useEventInteractions } from "../hooks/useEventInteractions";
import { Event } from "../types/event";

const LikedEvents = () => {
  const { likedEvents, loading, error, removeFromLiked, updateEvent } = useLikedEvents();
  const { toggleLike } = useEventInteractions();
  const toast = useToast();
  const navigate = useNavigate();

  const handleUnlikeEvent = async (event: Event) => {
    try {
      await toggleLike(event);
      // Remove from local state
      removeFromLiked(event.id);
      toast({
        title: "Event Unliked",
        description: "Event removed from your liked list",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleRemoveEvent = (event: Event) => {
    handleUnlikeEvent(event);
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
      <Heading textAlign={{ base: "center", md: "left" }} size="md" mb={6}>
        Liked Events
      </Heading>

      {likedEvents.length > 0 ? (
        <SimpleGrid spacing={6} columns={{ base: 1, md: 2 }}>
          {likedEvents.map((event) => (
            <Box key={event.id}>
              <EventCard
                event={event}
                onEventUpdate={(updatedEvent) => {
                  // Update local state when event is updated
                  updateEvent(updatedEvent);
                }}
              />
              <Button
                mt={2}
                size="sm"
                colorScheme="red"
                onClick={() => handleRemoveEvent(event)}
              >
                Unlike Event
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="xl" mb={4}>
            You have no liked events yet.
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

export default LikedEvents;
