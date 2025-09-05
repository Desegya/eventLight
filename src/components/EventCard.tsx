import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Button,
  Box,
  HStack,
  Divider,
  Icon,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaTag,
  FaUserAlt,
  FaCheckCircle,
  FaHeart,
  FaBookmark,
} from "react-icons/fa";
import { TbCurrencyNaira } from "react-icons/tb";
import { Link } from "react-router-dom";
import { Event } from "../types/event";
import { useEventInteractions } from "../hooks/useEventInteractions";
import { useState } from "react";

interface EventCardProps {
  event: Event;
  onEventUpdate?: (updatedEvent: Event) => void;
}

const EventCard = ({ event, onEventUpdate }: EventCardProps) => {
  const [localEvent, setLocalEvent] = useState(event);
  const { toggleLike, toggleSave, isLikeLoading, isSaveLoading } =
    useEventInteractions();

  const isFree = event.pricing.toLowerCase() === "free";

  const handleLike = async () => {
    try {
      await toggleLike(localEvent, (updated) => {
        setLocalEvent(updated);
        onEventUpdate?.(updated);
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleSave = async () => {
    try {
      await toggleSave(localEvent, (updated) => {
        setLocalEvent(updated);
        onEventUpdate?.(updated);
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  // Dark/Light mode values
  const cardBg = useColorModeValue("white", "gray.700");
  const cardTextColor = useColorModeValue("gray.800", "white");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const iconColor = useColorModeValue("white", "blue.800");
  const priceButtonBg = isFree ? "green.500" : "red.500";
  const priceButtonHover = isFree ? "green.400" : "red.400";
  const detailColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box position="relative" role="group" maxW="sm">
      {/* Hover Icons */}
      <HStack
        position="absolute"
        top="2"
        right="2"
        spacing={2}
        display={{ base: "flex", md: "none" }}
        _groupHover={{ display: "flex" }}
        zIndex="1"
      >
        <Tooltip
          label={localEvent.is_liked ? "Unlike this event" : "Like this event"}
          fontSize="sm"
        >
          <Box
            as="button"
            p={2}
            borderRadius="full"
            _hover={{ bg: hoverBg }}
            onClick={handleLike}
            disabled={isLikeLoading(localEvent.id)}
          >
            <Icon
              as={FaHeart}
              boxSize={4}
              color={localEvent.is_liked ? "red.500" : iconColor}
            />
          </Box>
        </Tooltip>
        <Tooltip
          label={localEvent.is_saved ? "Unsave this event" : "Save this event"}
          fontSize="sm"
        >
          <Box
            as="button"
            p={2}
            borderRadius="full"
            _hover={{ bg: hoverBg }}
            onClick={handleSave}
            disabled={isSaveLoading(localEvent.id)}
          >
            <Icon
              as={FaBookmark}
              boxSize={4}
              color={localEvent.is_saved ? "blue.500" : iconColor}
            />
          </Box>
        </Tooltip>
      </HStack>

      {/* Card */}
      <Card
        maxW="sm"
        borderRadius="md"
        overflow="hidden"
        boxShadow="lg"
        bg={cardBg}
        color={cardTextColor}
      >
        <Image
          src={event.image || "/placeholder-image.jpg"}
          alt={event.title}
          borderRadius="md"
        />

        <CardBody>
          <Stack spacing={4}>
            {/* Event Name with Pricing Button */}
            <HStack justifyContent="left" alignItems="center" gap={6}>
              <Heading size="md">{event.title}</Heading>
              <Button
                size="xs"
                bg={priceButtonBg}
                color="white"
                _hover={{ bg: priceButtonHover }}
                leftIcon={
                  isFree ? (
                    <Icon as={FaCheckCircle} />
                  ) : (
                    <Icon as={TbCurrencyNaira} />
                  )
                }
              >
                {isFree ? "Free" : "Paid"}
              </Button>
            </HStack>

            {/* HStack for Date and Location with Icons */}
            <HStack spacing={4} color={detailColor}>
              <HStack spacing={2}>
                <Icon as={FaCalendar} boxSize={4} />
                <Text fontSize="sm">
                  {new Date(event.date).toLocaleDateString()}
                </Text>
              </HStack>
              <Divider orientation="vertical" />
              <HStack spacing={2}>
                <Icon as={FaMapMarkerAlt} boxSize={4} />
                <Text fontSize="sm">{event.location}</Text>
              </HStack>
            </HStack>

            {/* Category and Organizer */}
            <HStack spacing={4} color={detailColor}>
              <HStack spacing={2}>
                <Icon as={FaTag} boxSize={4} />
                <Text fontSize="sm">{event.category}</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FaUserAlt} boxSize={4} />
                <Text fontSize="sm" isTruncated maxW="150px">
                  Organizer #{event.created_by}
                </Text>
              </HStack>
            </HStack>

            {/* View Details Button - Using Link for Navigation */}
            <Box textAlign="center" w="100%">
              <Link to={`/events/${event.id}`}>
                <Button
                  bg="blue.800"
                  color="white"
                  size="sm"
                  w="100%"
                  _hover={{
                    bg: "blue.700",
                    transform: "scale(1.03)",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  View Details
                </Button>
              </Link>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default EventCard;
