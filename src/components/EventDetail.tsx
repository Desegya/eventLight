import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  Button,
  Flex,
  HStack,
  VStack,
  Icon,
  IconButton,
  Badge,
  Spinner,
  Center,
  useColorModeValue,
  Divider,
  AspectRatio,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiTag,
  FiUsers,
  FiGlobe,
  FiClock,
  FiShare2,
  FiHeart,
  FiBookmark,
  FiAlertCircle,
  FiExternalLink,
} from "react-icons/fi";
import { useEvent } from "../hooks/useEvents";
import { useEventInteractions } from "../hooks/useEventInteractions";
import { format, parseISO, isPast } from "date-fns";
import { useAuth } from "../contexts/AuthContext";

const fmt = (snake: string) =>
  snake.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CountdownUnit = ({ value, label }: { value: number; label: string }) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const text = useColorModeValue("gray.800", "white");
  return (
    <VStack spacing={0} bg={bg} borderRadius="xl" px={4} py={3} minW="64px">
      <Text fontWeight="800" fontSize="2xl" letterSpacing="-0.04em" color={text} lineHeight="1">
        {String(value).padStart(2, "0")}
      </Text>
      <Text fontSize="10px" fontWeight="600" textTransform="uppercase" letterSpacing="0.1em" color="gray.500" mt={1}>
        {label}
      </Text>
    </VStack>
  );
};

const MetaRow = ({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onClick?: () => void;
}) => {
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const labelColor = useColorModeValue("gray.500", "gray.400");
  const valueColor = useColorModeValue("gray.800", "white");
  return (
    <HStack
      spacing={4}
      py={3.5}
      borderBottom="1px solid"
      borderColor={borderColor}
      align="center"
    >
      <Box
        w="32px" h="32px" borderRadius="lg"
        bg={useColorModeValue("gray.100", "gray.700")}
        display="flex" alignItems="center" justifyContent="center" flexShrink={0}
      >
        <Icon as={icon} boxSize={3.5} color="brand.500" />
      </Box>
      <Box flex={1}>
        <Text fontSize="xs" color={labelColor} fontWeight="600" mb={0.5}>{label}</Text>
        <Text
          fontSize="sm" fontWeight="600" color={valueColor}
          cursor={onClick ? "pointer" : undefined}
          _hover={onClick ? { color: "brand.500" } : undefined}
          onClick={onClick}
        >
          {value}
        </Text>
      </Box>
    </HStack>
  );
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const eventId = id ? parseInt(id) : 0;
  const { event, loading, error } = useEvent(eventId);
  const { toggleLike, toggleSave } = useEventInteractions();

  const [localEvent, setLocalEvent] = useState(event);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => { setLocalEvent(event); }, [event]);

  useEffect(() => {
    if (!localEvent?.date) return;
    const eventDate = parseISO(localEvent.date);
    if (isNaN(eventDate.getTime())) return;
    const tick = () => setTimeRemaining(eventDate.getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [localEvent?.date]);

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const headingColor = useColorModeValue("gray.900", "white");
  const bodyColor = useColorModeValue("gray.600", "gray.300");

  if (loading) {
    return (
      <Center minH="60vh" bg={pageBg}>
        <VStack spacing={3}>
          <Spinner size="lg" color="brand.500" thickness="3px" speed="0.7s" />
          <Text fontSize="sm" color={mutedColor}>Loading event…</Text>
        </VStack>
      </Center>
    );
  }

  if (error || !event) {
    return (
      <Center minH="60vh" bg={pageBg} flexDirection="column" gap={4}>
        <Box
          w="56px" h="56px" borderRadius="full"
          bg={useColorModeValue("red.50", "red.900")}
          display="flex" alignItems="center" justifyContent="center"
        >
          <Icon as={FiAlertCircle} boxSize={6} color="red.400" />
        </Box>
        <VStack spacing={1}>
          <Text fontWeight="700" fontSize="lg" color={headingColor}>
            {error || "Event not found"}
          </Text>
          <Text fontSize="sm" color={mutedColor} textAlign="center" maxW="300px">
            We couldn't load this event. It may have been removed or the link is invalid.
          </Text>
        </VStack>
        <Button variant="brand" borderRadius="full" size="sm" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </Center>
    );
  }

  const parsedDate = parseISO(event.date);
  const formattedDate = format(parsedDate, "EEEE, d MMMM yyyy");
  const formattedTime = format(parsedDate, "h:mm a");
  const eventPast = isPast(parsedDate);

  const days = Math.max(0, Math.floor(timeRemaining / 86400000));
  const hours = Math.max(0, Math.floor((timeRemaining % 86400000) / 3600000));
  const mins = Math.max(0, Math.floor((timeRemaining % 3600000) / 60000));
  const secs = Math.max(0, Math.floor((timeRemaining % 60000) / 1000));

  const handleLike = async () => {
    if (!isAuthenticated) { navigate("/auth/login"); return; }
    if (!localEvent) return;
    setLikeLoading(true);
    try {
      await toggleLike(localEvent, setLocalEvent);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) { navigate("/auth/login"); return; }
    if (!localEvent) return;
    setSaveLoading(true);
    try {
      await toggleSave(localEvent, setLocalEvent);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({ title: "Link copied!", status: "info", duration: 2000, isClosable: true, position: "top-right" });
    });
  };

  const mapQuery = encodeURIComponent(event.location);

  return (
    <Box minH="100vh" bg={pageBg}>
      {/* Back nav */}
      <Box px={{ base: 4, md: 8, lg: 12 }} pt={6} pb={4} maxW="1100px" mx="auto">
        <Button
          leftIcon={<FiArrowLeft size={15} />}
          variant="ghost"
          size="sm"
          borderRadius="full"
          color={mutedColor}
          onClick={() => navigate(-1)}
          _hover={{ color: headingColor }}
        >
          Back
        </Button>
      </Box>

      <Box maxW="1100px" mx="auto" px={{ base: 4, md: 8, lg: 12 }} pb={16}>
        <Flex gap={8} align="flex-start" direction={{ base: "column", lg: "row" }}>

          {/* ── Left: main content ── */}
          <Box flex={1} minW={0}>

            {/* Hero image */}
            <Box borderRadius="2xl" overflow="hidden" mb={6} boxShadow="0 8px 40px rgba(0,0,0,0.12)">
              <AspectRatio ratio={16 / 7}>
                <Image
                  src={event.image || `https://picsum.photos/seed/${event.id}/900/400`}
                  alt={event.title}
                  objectFit="cover"
                  w="full"
                  h="full"
                />
              </AspectRatio>
            </Box>

            {/* Badges row */}
            <HStack spacing={2} mb={4} flexWrap="wrap">
              <Badge
                colorScheme="purple"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                fontWeight="700"
                textTransform="capitalize"
              >
                {event.category}
              </Badge>
              <Badge
                colorScheme={event.pricing === "free" ? "green" : "orange"}
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                fontWeight="700"
                textTransform="capitalize"
              >
                {event.pricing}
              </Badge>
              {event.approval_status !== "approved" && (
                <Badge
                  colorScheme={event.approval_status === "pending" ? "yellow" : "red"}
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="capitalize"
                >
                  {event.approval_status}
                </Badge>
              )}
            </HStack>

            {/* Title + actions */}
            <Flex align="flex-start" justify="space-between" gap={4} mb={5}>
              <Text
                fontWeight="800"
                fontSize={{ base: "2xl", md: "3xl" }}
                letterSpacing="-0.03em"
                lineHeight="1.15"
                color={headingColor}
              >
                {event.title}
              </Text>

              <HStack spacing={2} flexShrink={0} mt={1}>
                <Tooltip label={isAuthenticated ? (localEvent?.is_liked ? "Unlike" : "Like") : "Log in to like"}>
                  <IconButton
                    aria-label="Like event"
                    icon={<FiHeart size={16} />}
                    borderRadius="full"
                    size="sm"
                    variant={localEvent?.is_liked ? "solid" : "outline"}
                    colorScheme={localEvent?.is_liked ? "red" : "gray"}
                    isLoading={likeLoading}
                    onClick={handleLike}
                  />
                </Tooltip>
                <Tooltip label={isAuthenticated ? (localEvent?.is_saved ? "Unsave" : "Save") : "Log in to save"}>
                  <IconButton
                    aria-label="Save event"
                    icon={<FiBookmark size={16} />}
                    borderRadius="full"
                    size="sm"
                    variant={localEvent?.is_saved ? "solid" : "outline"}
                    colorScheme={localEvent?.is_saved ? "purple" : "gray"}
                    isLoading={saveLoading}
                    onClick={handleSave}
                  />
                </Tooltip>
                <Tooltip label="Copy link">
                  <IconButton
                    aria-label="Share event"
                    icon={<FiShare2 size={16} />}
                    borderRadius="full"
                    size="sm"
                    variant="outline"
                    onClick={handleShare}
                  />
                </Tooltip>
              </HStack>
            </Flex>

            {/* Interaction counts */}
            {((localEvent?.likes_count ?? 0) > 0 || (localEvent?.saves_count ?? 0) > 0) && (
              <HStack spacing={4} mb={6}>
                {(localEvent?.likes_count ?? 0) > 0 && (
                  <HStack spacing={1.5}>
                    <Icon as={FiHeart} boxSize={3.5} color="red.400" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="600">
                      {localEvent?.likes_count} {localEvent?.likes_count === 1 ? "like" : "likes"}
                    </Text>
                  </HStack>
                )}
                {(localEvent?.saves_count ?? 0) > 0 && (
                  <HStack spacing={1.5}>
                    <Icon as={FiBookmark} boxSize={3.5} color="brand.400" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="600">
                      {localEvent?.saves_count} saved
                    </Text>
                  </HStack>
                )}
              </HStack>
            )}

            {/* Description */}
            <Box
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="2xl"
              px={6}
              py={5}
              mb={5}
            >
              <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={mutedColor} mb={3}>
                About this event
              </Text>
              <Text fontSize="sm" lineHeight="1.8" color={bodyColor} whiteSpace="pre-wrap">
                {event.description}
              </Text>
            </Box>

            {/* Meta grid */}
            <Box
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="2xl"
              px={6}
              pt={1}
              pb={2}
            >
              <MetaRow icon={FiCalendar} label="Date" value={formattedDate} />
              <MetaRow icon={FiClock} label="Time" value={formattedTime} />
              <MetaRow
                icon={FiMapPin}
                label="Location"
                value={event.location}
                onClick={() => window.open(`https://www.google.com/maps?q=${mapQuery}`, "_blank", "noopener")}
              />
              <MetaRow icon={FiTag} label="Category" value={fmt(event.category)} />
              {event.event_type && <MetaRow icon={FiCalendar} label="Event Type" value={fmt(event.event_type)} />}
              {event.language && <MetaRow icon={FiGlobe} label="Language" value={fmt(event.language)} />}
              {event.age_group && <MetaRow icon={FiUsers} label="Age Group" value={fmt(event.age_group)} />}

              {/* Map link row */}
              <HStack py={3.5} spacing={4}>
                <Box
                  w="32px" h="32px" borderRadius="lg"
                  bg={useColorModeValue("gray.100", "gray.700")}
                  display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                >
                  <Icon as={FiExternalLink} boxSize={3.5} color="brand.500" />
                </Box>
                <Button
                  as="a"
                  href={`https://www.google.com/maps?q=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="brand-outline"
                  size="xs"
                  borderRadius="full"
                  px={4}
                  leftIcon={<FiMapPin size={11} />}
                >
                  View on Google Maps
                </Button>
              </HStack>
            </Box>
          </Box>

          {/* ── Right: sidebar ── */}
          <Box
            w={{ base: "full", lg: "300px" }}
            flexShrink={0}
            position={{ lg: "sticky" }}
            top={{ lg: "80px" }}
          >
            <VStack spacing={4} align="stretch">

              {/* Countdown */}
              <Box
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="2xl"
                p={5}
              >
                <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={mutedColor} mb={4}>
                  {eventPast ? "Event has ended" : "Starts in"}
                </Text>
                {eventPast ? (
                  <Text fontSize="sm" color={mutedColor} fontStyle="italic">
                    This event took place on {formattedDate}.
                  </Text>
                ) : (
                  <HStack spacing={2} justify="center">
                    <CountdownUnit value={days} label="Days" />
                    <CountdownUnit value={hours} label="Hours" />
                    <CountdownUnit value={mins} label="Mins" />
                    <CountdownUnit value={secs} label="Secs" />
                  </HStack>
                )}
              </Box>

              {/* CTA */}
              <Box
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="2xl"
                p={5}
              >
                <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={mutedColor} mb={3}>
                  Interested?
                </Text>
                <VStack spacing={2.5} align="stretch">
                  <Button
                    variant="brand"
                    borderRadius="full"
                    size="md"
                    w="full"
                    isDisabled={eventPast}
                  >
                    {eventPast ? "Event ended" : "Register / RSVP"}
                  </Button>
                  <Button
                    variant="brand-outline"
                    borderRadius="full"
                    size="md"
                    w="full"
                    leftIcon={<FiBookmark size={14} />}
                    isLoading={saveLoading}
                    onClick={handleSave}
                  >
                    {localEvent?.is_saved ? "Saved" : "Save for later"}
                  </Button>
                </VStack>
                <Text fontSize="xs" color={mutedColor} textAlign="center" mt={3}>
                  You'll get a reminder 24 hours before the event.
                </Text>
              </Box>

              {/* Organizer */}
              <Box
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="2xl"
                p={5}
              >
                <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={mutedColor} mb={3}>
                  Organizer
                </Text>
                <HStack spacing={3}>
                  <Box
                    w="40px" h="40px" borderRadius="full"
                    bg="brand.600"
                    display="flex" alignItems="center" justifyContent="center"
                    flexShrink={0}
                  >
                    <Text color="white" fontWeight="700" fontSize="sm">
                      {String(event.created_by).charAt(0)}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="700" fontSize="sm" color={headingColor}>
                      User #{event.created_by}
                    </Text>
                    <Text fontSize="xs" color={mutedColor}>Event organizer</Text>
                  </Box>
                </HStack>
              </Box>

            </VStack>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default EventDetail;
