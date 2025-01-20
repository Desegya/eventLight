import { useState } from "react";
import {
  Box,
  Heading,
  Button,
  Text,
  useToast,
  SimpleGrid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard"; // Import the EventCard component

const SavedEvents = () => {
  const [savedEvents, setSavedEvents] = useState([
    {
      eventid: 1,
      eventName: "Gospel Worship Night",
      eventDate: "2025-01-20",
      eventLocation: "Victory Church, Lagos",
      eventCategory: "Worship",
      eventOrganizer: "Victory Church",
      eventPricing: "Free",
      eventImage: "http://dummyimage.com/200x100.png/cc0000/ffffff", // Replace with actual image URL
    },
    {
      eventid: 2,
      eventName: "Christian Youth Conference",
      eventDate: "2025-02-10",
      eventLocation: "Faith Arena, Abuja",
      eventCategory: "Conference",
      eventOrganizer: "Faith Foundation",
      eventPricing: "Paid",
      eventImage: "http://dummyimage.com/200x100.png/cc0000/dddddd", // Replace with actual image URL
    },
    {
      eventid: 2,
      eventName: "Christian Youth Conference",
      eventDate: "2025-02-10",
      eventLocation: "Faith Arena, Abuja",
      eventCategory: "Conference",
      eventOrganizer: "Faith Foundation",
      eventPricing: "Paid",
      eventImage: "http://dummyimage.com/200x100.png/cc0000/dddddd", // Replace with actual image URL
    },
    {
      eventid: 2,
      eventName: "Christian Youth Conference",
      eventDate: "2025-02-10",
      eventLocation: "Faith Arena, Abuja",
      eventCategory: "Conference",
      eventOrganizer: "Faith Foundation",
      eventPricing: "Paid",
      eventImage: "http://dummyimage.com/200x100.png/cc0000/dddddd", // Replace with actual image URL
    },
  ]);

  const toast = useToast();
  const navigate = useNavigate();

  const handleRemoveEvent = (id: number) => {
    setSavedEvents((prev) => prev.filter((event) => event.eventid !== id));
    toast({
      title: "Event Removed",
      description: "The event has been removed from your saved list.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4} alignSelf="center" justifySelf="center">
      <Heading size="md" mb={6}>
        Saved Events
      </Heading>

      {savedEvents.length > 0 ? (
        <SimpleGrid spacing={6} columns={{ base: 1, md: 2 }}>
          {savedEvents.map((event) => (
            <Box key={event.eventid}>
              <EventCard
                {...event} // Pass all event properties as props to EventCard
              />
              <Button
                mt={2}
                size="sm"
                colorScheme="red"
                onClick={() => handleRemoveEvent(event.eventid)}
              >
                Remove Event
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
