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
import { useMyEvents } from "../hooks/useUserEvents";

const MyEvents = () => {
  const { myEvents, loading } = useMyEvents();
  const toast = useToast();
  const navigate = useNavigate();

  const handleDeleteEvent = async () => {
    // TODO: Implement delete functionality when API endpoint is available
    toast({
      title: "Delete functionality",
      description: "Delete event feature coming soon",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEventUpdate = () => {
    // Event updates are handled by the hook itself
    // This callback is mainly for refreshing data if needed
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
        My Events
      </Heading>

      {myEvents.length > 0 ? (
        <SimpleGrid spacing={6} columns={{ base: 1, md: 2 }}>
          {myEvents.map((event) => (
            <Box key={event.id}>
              <EventCard
                event={event}
                onEventUpdate={handleEventUpdate}
              />
              <Button
                mt={2}
                size="sm"
                colorScheme="red"
                onClick={() => handleDeleteEvent()}
              >
                Delete Event
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="xl" mb={4}>
            You haven't created any events yet.
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => navigate("/add-event")}
          >
            Create Your First Event
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MyEvents;
