import { useLocation, Link, useNavigate } from "react-router-dom";
import { Box, Button, Heading, Text, useToast } from "@chakra-ui/react";
import EventCard from "./EventCard";

const PreviewEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const eventData = location.state as {
    eventid: number;
    eventName: string;
    eventDate: string;
    eventLocation: string;
    eventCategory: string;
    eventOrganizer: string;
    eventPricing: string;
    eventImage: string;
  };

  const handleSubmit = () => {
    // Simulate an API call or submission process
    setTimeout(() => {
      toast({
        title: "Event Submitted!",
        description:
          "Your event has been sent for admin review. It will appear on the events page once approved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Redirect to homepage or dashboard
      navigate("/");
    }, 2000); // Simulate a processing delay
  };

  return (
    <Box
      p={6}
      display="flex"
      flexDirection="column"
      maxW="600px"
      alignItems="center"
      mx="auto"
    >
      {/* Preview Heading */}
      <Box mb={6}>
        <Heading as="h1">Preview Event</Heading>
      </Box>

      {/* EventCard */}
      <EventCard
        eventid={eventData.eventid}
        eventName={eventData.eventName}
        eventDate={eventData.eventDate}
        eventLocation={eventData.eventLocation}
        eventCategory={eventData.eventCategory}
        eventOrganizer={eventData.eventOrganizer}
        eventPricing={eventData.eventPricing}
        eventImage={eventData.eventImage}
      />

      {/* Buttons Section */}
      <Box mt={6}>
        {/* Edit Event Button */}
        <Link to="/events/add-event" state={eventData}>
          <Button bg="blue.800" mr={4}>
            Edit Event
          </Button>
        </Link>

        {/* Submit Event Button */}
        <Button bg="blue.800" onClick={handleSubmit}>
          Submit Event
        </Button>
      </Box>

      {/* Note about approval */}
      <Box mt={4}>
        <Text fontSize="sm" color="gray.500">
          You will be notified once your event is approved.
        </Text>
      </Box>
    </Box>
  );
};

export default PreviewEvent;
