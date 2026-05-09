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
import { FiHeart, FiCompass } from "react-icons/fi";
import EventCard from "./EventCard";
import { useLikedEvents } from "../hooks/useUserEvents";
import { useEventInteractions } from "../hooks/useEventInteractions";
import { Event } from "../types/event";

const LikedEvents = () => {
  const { likedEvents, loading, removeFromLiked, updateEvent } = useLikedEvents();
  const { toggleLike } = useEventInteractions();

  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const emptyBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleUnlike = async (event: Event) => {
    try {
      await toggleLike(event, (updated) => {
        updateEvent(updated);
        if (!updated.is_liked) removeFromLiked(updated.id);
      });
    } catch {
      // handled in hook
    }
  };

  if (loading) {
    return (
      <Center h="240px" flexDirection="column" gap={4}>
        <Spinner size="lg" color="brand.500" thickness="3px" speed="0.7s" />
        <Text fontSize="sm" color={mutedColor}>Loading liked events…</Text>
      </Center>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={6}>
        <Heading size="md" letterSpacing="-0.02em">Liked Events</Heading>
        {likedEvents.length > 0 && (
          <Text fontSize="sm" color={mutedColor} fontWeight="500">
            {likedEvents.length} {likedEvents.length === 1 ? "event" : "events"}
          </Text>
        )}
      </HStack>

      {likedEvents.length === 0 ? (
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
            bg="red.50" display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={FiHeart} boxSize={6} color="red.400" />
          </Box>
          <VStack spacing={1}>
            <Text fontWeight="700" fontSize="lg" letterSpacing="-0.02em">No liked events</Text>
            <Text fontSize="sm" color={mutedColor} textAlign="center" maxW="280px">
              Events you like will appear here. Start exploring to find ones you love.
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
          {likedEvents.map((event) => (
            <Box key={event.id}>
              <EventCard event={event} onEventUpdate={updateEvent} />
              <Button
                mt={2.5}
                size="sm"
                variant="outline"
                colorScheme="red"
                borderRadius="lg"
                w="full"
                leftIcon={<FiHeart size={13} />}
                onClick={() => handleUnlike(event)}
              >
                Unlike
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default LikedEvents;
