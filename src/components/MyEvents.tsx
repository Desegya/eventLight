import {
  Box,
  Heading,
  Button,
  Text,
  useToast,
  SimpleGrid,
  Spinner,
  Center,
  Icon,
  HStack,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiCalendar } from "react-icons/fi";
import EventCard from "./EventCard";
import { useMyEvents } from "../hooks/useUserEvents";
import { apiService } from "../services/api";

const MyEvents = () => {
  const { myEvents, loading, removeEvent } = useMyEvents();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const emptyBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const requestDelete = (eventId: number) => {
    setPendingDeleteId(eventId);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    onClose();
    setDeletingId(pendingDeleteId);
    try {
      await apiService.deleteEvent(pendingDeleteId);
      removeEvent(pendingDeleteId);
      toast({
        title: "Event deleted",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top-right",
      });
    } catch {
      toast({
        title: "Could not delete event",
        description: "Please try again.",
        status: "error",
        duration: 3500,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  if (loading) {
    return (
      <Center h="240px" flexDirection="column" gap={4}>
        <Spinner size="lg" color="brand.500" thickness="3px" speed="0.7s" />
        <Text fontSize="sm" color={mutedColor}>Loading your events…</Text>
      </Center>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={6}>
        <Heading size="md" letterSpacing="-0.02em">My Events</Heading>
        <Link to="/events/add-event">
          <Button variant="brand" size="sm" leftIcon={<FiPlus size={14} />} borderRadius="full">
            Create Event
          </Button>
        </Link>
      </HStack>

      {myEvents.length === 0 ? (
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
            <Icon as={FiCalendar} boxSize={6} color="brand.500" />
          </Box>
          <VStack spacing={1}>
            <Text fontWeight="700" fontSize="lg" letterSpacing="-0.02em">No events yet</Text>
            <Text fontSize="sm" color={mutedColor}>
              Create your first event and start building your audience.
            </Text>
          </VStack>
          <Link to="/events/add-event">
            <Button variant="brand" size="sm" leftIcon={<FiPlus size={14} />} borderRadius="full" mt={2}>
              Create Your First Event
            </Button>
          </Link>
        </Center>
      ) : (
        <SimpleGrid spacing={5} columns={{ base: 1, md: 2 }}>
          {myEvents.map((event) => (
            <Box key={event.id}>
              <EventCard event={event} />
              <Button
                mt={2.5}
                size="sm"
                colorScheme="red"
                variant="outline"
                borderRadius="lg"
                w="full"
                onClick={() => requestDelete(event.id)}
                isLoading={deletingId === event.id}
                loadingText="Deleting…"
              >
                Delete Event
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay backdropFilter="blur(4px)" bg="blackAlpha.300">
          <AlertDialogContent borderRadius="2xl" mx={4}>
            <AlertDialogHeader fontSize="lg" fontWeight="700" letterSpacing="-0.02em">
              Delete Event
            </AlertDialogHeader>
            <AlertDialogBody color={mutedColor}>
              Are you sure? This cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter gap={2}>
              <Button ref={cancelRef} onClick={onClose} variant="ghost" borderRadius="lg">
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} borderRadius="lg">
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default MyEvents;
