import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useToast,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { FiArrowLeft, FiEdit2, FiSend, FiInfo } from "react-icons/fi";
import EventCard from "./EventCard";
import { Event } from "../types/event";

const PreviewEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const eventData = location.state as Event;

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const infoBg = useColorModeValue("brand.50", "gray.800");
  const infoBorder = useColorModeValue("brand.100", "brand.900");

  const handleSubmit = () => {
    setTimeout(() => {
      toast({
        title: "Event submitted for review!",
        description: "It will appear on eventlight once approved by our team.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      navigate("/dashboard/my-events");
    }, 1200);
  };

  if (!eventData) {
    return (
      <Flex minH="100vh" bg={pageBg} align="center" justify="center" direction="column" gap={4}>
        <Text fontWeight="700" fontSize="lg">No event data found</Text>
        <Text fontSize="sm" color={mutedColor}>Please go back and fill in the event details first.</Text>
        <Link to="/events/add-event">
          <Button variant="brand" borderRadius="full" size="sm">
            Back to form
          </Button>
        </Link>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg={pageBg}>
      {/* Sticky header */}
      <Box
        bg={cardBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        px={{ base: 4, md: 8 }}
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex maxW="680px" mx="auto" align="center" justify="space-between">
          <HStack spacing={4}>
            <Link to="/events/add-event" state={eventData}>
              <IconButton
                aria-label="Back to form"
                icon={<FiArrowLeft size={18} />}
                variant="ghost"
                borderRadius="full"
                size="sm"
              />
            </Link>
            <Box>
              <Text fontWeight="800" fontSize="lg" letterSpacing="-0.03em" lineHeight="1.1">
                Preview Event
              </Text>
              <Text fontSize="xs" color={mutedColor}>
                This is how your event will appear to attendees
              </Text>
            </Box>
          </HStack>
          <Badge colorScheme="yellow" borderRadius="full" px={3} py={1} fontSize="xs">
            Preview mode
          </Badge>
        </Flex>
      </Box>

      {/* Body */}
      <Box maxW="680px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <VStack spacing={6} align="stretch">
          {/* Info notice */}
          <HStack
            bg={infoBg}
            border="1px solid"
            borderColor={infoBorder}
            borderRadius="xl"
            px={4}
            py={3}
            spacing={3}
            align="flex-start"
          >
            <Icon as={FiInfo} boxSize={4} color="brand.500" mt={0.5} flexShrink={0} />
            <Text fontSize="sm" color="brand.600" lineHeight="1.5">
              Review your event below. When you're happy with it, submit it for admin approval — it
              will go live on eventlight once approved.
            </Text>
          </HStack>

          {/* Event card preview */}
          <Box maxW="400px" mx="auto" w="full">
            <EventCard event={eventData} />
          </Box>

          {/* Action buttons */}
          <Flex
            gap={3}
            justify="center"
            direction={{ base: "column", sm: "row" }}
            pt={2}
          >
            <Link to="/events/add-event" state={eventData}>
              <Button
                leftIcon={<FiEdit2 size={14} />}
                variant="brand-outline"
                borderRadius="full"
                size="md"
                px={6}
                w={{ base: "full", sm: "auto" }}
              >
                Edit Event
              </Button>
            </Link>
            <Button
              leftIcon={<FiSend size={14} />}
              variant="brand"
              borderRadius="full"
              size="md"
              px={7}
              onClick={handleSubmit}
              w={{ base: "full", sm: "auto" }}
            >
              Submit for Review
            </Button>
          </Flex>

          <Text fontSize="xs" color={mutedColor} textAlign="center" pb={8}>
            You'll receive a notification once your event is approved and published.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default PreviewEvent;
