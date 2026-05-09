import {
  Box,
  Heading,
  Button,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  Icon,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiBookmark, FiCompass } from "react-icons/fi";
import EventCard from "./EventCard";
import { useSavedEvents } from "../hooks/useUserEvents";
import { useEventInteractions } from "../hooks/useEventInteractions";
import { Event } from "../types/event";

const SavedEvents = () => {
  const { savedEvents, loading, removeFromSaved, updateEvent } = useSavedEvents();
  const { toggleSave } = useEventInteractions();

  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const emptyBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleUnsave = async (event: Event) => {
    try {
      await toggleSave(event, (updated) => {
        updateEvent(updated);
        if (!updated.is_saved) removeFromSaved(updated.id);
      });
    } catch {
      // handled in hook
    }
  };

  if (loading) {
    return (
      <Center h="240px" flexDirection="column" gap={4}>
        <Spinner size="lg" color="brand.500" thickness="3px" speed="0.7s" />
        <Text fontSize="sm" color={mutedColor}>Loading saved events…</Text>
      </Center>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={6}>
        <Heading size="md" letterSpacing="-0.02em">Saved Events</Heading>
        {savedEvents.length > 0 && (
          <Text fontSize="sm" color={mutedColor} fontWeight="500">
            {savedEvents.length} {savedEvents.length === 1 ? "event" : "events"}
          </Text>
        )}
      </HStack>

      {savedEvents.length === 0 ? (
        <Center
          flexDirection="column"
          gap={4}
          py={16}
          borderRadius="2xl"
          bg={emptyBg}
          border="1.5px dashed"
          borderColor={borderColor}
        >
          <Box
            w="56px" h="56px" borderRadius="full"
            bg="brand.50" display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={FiBookmark} boxSize={6} color="brand.500" />
          </Box>
          <VStack spacing={1}>
            <Text fontWeight="700" fontSize="lg" letterSpacing="-0.02em">No saved events</Text>
            <Text fontSize="sm" color={mutedColor} textAlign="center" maxW="280px">
              Bookmark events you want to attend and they'll show up here.
            </Text>
          </VStack>
          <Link to="/">
            <Button variant="brand" size="sm" leftIcon={<FiCompass size={14} />} borderRadius="full" mt={2}>
              Discover Events
            </Button>
          </Link>
        </Center>
      ) : (
        <SimpleGrid spacing={5} columns={{ base: 1, md: 2 }}>
          {savedEvents.map((event) => (
            <Box key={event.id}>
              <EventCard event={event} onEventUpdate={updateEvent} />
              <Button
                mt={2.5}
                size="sm"
                variant="outline"
                colorScheme="purple"
                borderRadius="lg"
                w="full"
                leftIcon={<FiBookmark size={13} />}
                onClick={() => handleUnsave(event)}
              >
                Unsave
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default SavedEvents;
