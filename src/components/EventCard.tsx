import {
  Box,
  Image,
  Text,
  HStack,
  VStack,
  Icon,
  Badge,
  Flex,
  Tooltip,
  useColorModeValue,
  AspectRatio,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiMapPin,
  FiHeart,
  FiBookmark,
  FiArrowUpRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { Event } from "../types/event";
import { useEventInteractions } from "../hooks/useEventInteractions";
import { useState } from "react";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  onEventUpdate?: (updatedEvent: Event) => void;
}

const EventCard = ({ event, onEventUpdate }: EventCardProps) => {
  const [localEvent, setLocalEvent] = useState(event);
  const { toggleLike, toggleSave, isLikeLoading, isSaveLoading } =
    useEventInteractions();

  const isFree = event.pricing.toLowerCase() === "free";

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await toggleLike(localEvent, (updated) => {
        setLocalEvent(updated);
        onEventUpdate?.(updated);
      });
    } catch {
      // handled in hook
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await toggleSave(localEvent, (updated) => {
        setLocalEvent(updated);
        onEventUpdate?.(updated);
      });
    } catch {
      // handled in hook
    }
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const hoverBorderColor = useColorModeValue("brand.300", "brand.600");
  const hoverShadow = useColorModeValue(
    "0 16px 48px rgba(124,58,237,0.14)",
    "0 16px 48px rgba(124,58,237,0.28)"
  );
  const textColor = useColorModeValue("gray.900", "white");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const linkColor = useColorModeValue("brand.600", "brand.400");

  const formattedDate = (() => {
    try {
      return format(new Date(event.date), "MMM d, yyyy");
    } catch {
      return event.date;
    }
  })();

  const fallbackImage =
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=75&auto=format";

  return (
    <Link to={`/events/${event.id}`} style={{ display: "block" }}>
      <Box
        bg={cardBg}
        borderRadius="2xl"
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}
        transition="all 0.25s ease"
        _hover={{
          transform: "translateY(-5px)",
          boxShadow: hoverShadow,
          borderColor: hoverBorderColor,
        }}
        role="group"
        position="relative"
        cursor="pointer"
      >
        {/* Image */}
        <AspectRatio ratio={16 / 9}>
          <Box position="relative" overflow="hidden">
            <Image
              src={event.image || fallbackImage}
              alt={event.title}
              w="100%"
              h="100%"
              objectFit="cover"
              transition="transform 0.35s ease"
              _groupHover={{ transform: "scale(1.06)" }}
              fallbackSrc={fallbackImage}
            />

            {/* Gradient overlay */}
            <Box
              position="absolute"
              inset={0}
              bgGradient="linear(to-t, blackAlpha.700 0%, blackAlpha.100 50%, transparent 100%)"
            />

            {/* Top-left: price badge */}
            <Badge
              position="absolute"
              top={3}
              left={3}
              px={2.5}
              py={1}
              borderRadius="full"
              bg={isFree ? "rgba(16,185,129,0.88)" : "rgba(245,158,11,0.88)"}
              color="white"
              backdropFilter="blur(8px)"
              fontSize="xs"
              fontWeight="700"
              letterSpacing="0.02em"
            >
              {isFree ? "Free" : "Paid"}
            </Badge>

            {/* Top-right: like + save */}
            <HStack
              position="absolute"
              top={3}
              right={3}
              spacing={1.5}
              opacity={0}
              _groupHover={{ opacity: 1 }}
              transition="opacity 0.2s ease"
            >
              <Tooltip
                label={localEvent.is_liked ? "Unlike" : "Like"}
                fontSize="xs"
                hasArrow
              >
                <Box
                  as="button"
                  p={1.5}
                  borderRadius="full"
                  bg="rgba(0,0,0,0.45)"
                  backdropFilter="blur(8px)"
                  border="1px solid rgba(255,255,255,0.15)"
                  color={localEvent.is_liked ? "red.400" : "white"}
                  _hover={{
                    bg: "rgba(0,0,0,0.65)",
                    transform: "scale(1.1)",
                  }}
                  transition="all 0.15s ease"
                  onClick={handleLike}
                  disabled={isLikeLoading(localEvent.id)}
                >
                  <Icon
                    as={FiHeart}
                    boxSize={3.5}
                    fill={localEvent.is_liked ? "currentColor" : "none"}
                  />
                </Box>
              </Tooltip>

              <Tooltip
                label={localEvent.is_saved ? "Unsave" : "Save"}
                fontSize="xs"
                hasArrow
              >
                <Box
                  as="button"
                  p={1.5}
                  borderRadius="full"
                  bg="rgba(0,0,0,0.45)"
                  backdropFilter="blur(8px)"
                  border="1px solid rgba(255,255,255,0.15)"
                  color={localEvent.is_saved ? "brand.300" : "white"}
                  _hover={{
                    bg: "rgba(0,0,0,0.65)",
                    transform: "scale(1.1)",
                  }}
                  transition="all 0.15s ease"
                  onClick={handleSave}
                  disabled={isSaveLoading(localEvent.id)}
                >
                  <Icon
                    as={FiBookmark}
                    boxSize={3.5}
                    fill={localEvent.is_saved ? "currentColor" : "none"}
                  />
                </Box>
              </Tooltip>
            </HStack>

            {/* Bottom-left: category */}
            <Badge
              position="absolute"
              bottom={3}
              left={3}
              px={2.5}
              py={1}
              borderRadius="full"
              bg="rgba(124,58,237,0.85)"
              color="white"
              backdropFilter="blur(8px)"
              fontSize="xs"
              fontWeight="600"
              textTransform="capitalize"
            >
              {event.category.name}
            </Badge>
          </Box>
        </AspectRatio>

        {/* Card body */}
        <Box p={4}>
          <VStack align="stretch" spacing={3}>
            {/* Title */}
            <Text
              fontWeight="700"
              fontSize="md"
              color={textColor}
              lineHeight="1.3"
              letterSpacing="-0.02em"
              noOfLines={2}
            >
              {event.title}
            </Text>

            {/* Meta info */}
            <VStack align="stretch" spacing={1.5}>
              <HStack spacing={2} color={mutedColor} fontSize="sm">
                <Icon as={FiCalendar} boxSize={3.5} color="brand.500" flexShrink={0} />
                <Text>{formattedDate}</Text>
              </HStack>
              <HStack spacing={2} color={mutedColor} fontSize="sm">
                <Icon as={FiMapPin} boxSize={3.5} color="brand.500" flexShrink={0} />
                <Text noOfLines={1}>{event.location}</Text>
              </HStack>
            </VStack>

            {/* CTA */}
            <Flex
              align="center"
              justify="space-between"
              pt={1}
              borderTop="1px solid"
              borderColor={borderColor}
            >
              <Text
                fontSize="sm"
                fontWeight="600"
                color={linkColor}
                _groupHover={{ color: "brand.700" }}
                transition="color 0.15s ease"
              >
                View Details
              </Text>
              <Box
                w="28px"
                h="28px"
                borderRadius="full"
                bg="brand.50"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="brand.600"
                _groupHover={{
                  bg: "brand.600",
                  color: "white",
                  transform: "rotate(-45deg)",
                }}
                transition="all 0.2s ease"
              >
                <Icon as={FiArrowUpRight} boxSize={3.5} />
              </Box>
            </Flex>
          </VStack>
        </Box>
      </Box>
    </Link>
  );
};

export default EventCard;
