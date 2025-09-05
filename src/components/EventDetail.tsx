import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  Flex,
  Divider,
  useColorModeValue,
  Spinner,
  IconButton,
  Icon,
  Table,
  Tbody,
  Tr,
  Td,
  SimpleGrid,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaMapMarkerAlt,
  FaTag,
  FaUsers,
  FaDollarSign,
  FaLink,
  FaCalendarAlt,
  FaLanguage,
  FaChild,
} from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { IoHeartOutline, IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineTimer } from "react-icons/md";
import { useEvent } from "../hooks/useEvents";
import { format, parseISO } from "date-fns";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dateColor = useColorModeValue("gray.600", "gray.500");
  const detailColor = useColorModeValue("gray.700", "gray.500");
  const detailBorderColor = useColorModeValue("gray.500", "blue.800");

  const eventId = id ? parseInt(id) : 0;
  const { event, loading, error } = useEvent(eventId);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (event?.date) {
      const eventDate = parseISO(event.date);

      if (eventDate && !isNaN(eventDate.getTime())) {
        const now = new Date();
        setTimeRemaining(eventDate.getTime() - now.getTime());

        const interval = setInterval(() => {
          setTimeRemaining(eventDate.getTime() - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
      } else {
        setTimeRemaining(0);
      }
    }
  }, [event]);

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} textAlign="center">
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box p={4} textAlign="center">
        <Heading size="lg">Event Not Found</Heading>
        <Text mt={4}>
          We couldn't find the event you're looking for. Please try again later.
        </Text>
      </Box>
    );
  }

  const parsedDate = parseISO(event.date);
  const formattedDate = format(parsedDate, "EEEE, dd MMMM yyyy");

  const days = Math.floor(timeRemaining / (1000 * 3600 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 3600 * 24)) / (1000 * 3600)
  );
  const minutes = Math.floor((timeRemaining % (1000 * 3600)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  // For now, we'll use empty array for related events since we need to implement category filtering in the API
  const relatedEvents: any[] = [];

  return (
    <Box p={6}>
      <IconButton
        aria-label="Back to homepage"
        icon={<FaArrowLeft />}
        onClick={() => navigate("/")}
        variant="ghost"
        fontSize="2xl"
        mb={4}
      />

      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={5}
        justify="space-between"
      >
        {/* Left side content (Event Details) */}
        <Box flex="1">
          {/* Event Image */}
          <Image
            src={
              event.image || "http://dummyimage.com/200x100.png/cc0000/ffffff"
            }
            alt={event.title}
            borderRadius="md"
            mb={6}
            width="100%"
            objectFit="cover"
            boxShadow="md"
          />

          {/* Event Date */}
          <Text fontSize="lg" color={dateColor} mb={2}>
            {formattedDate}
          </Text>

          {/* Event Name */}
          <Flex
            align="center"
            alignContent="space-between"
            justifyContent="space-between"
            gap={4}
          >
            <Heading fontSize={{ base: "2xl", md: "4xl" }} mb={4}>
              {event.title}
            </Heading>

            <Box>
              <Flex gap={4}>
                <IconButton
                  aria-label="Like this event"
                  icon={<IoHeartOutline />}
                  borderRadius="full"
                  onClick={() => console.log("Event Liked")}
                />
                <IconButton
                  aria-label="Save this event"
                  icon={<CiBookmark />}
                  borderRadius="full"
                  onClick={() => console.log("Event Saved")}
                />
                <IconButton
                  aria-label="Share this event"
                  icon={<IoShareSocialOutline />}
                  borderRadius="full"
                  onClick={() => console.log("Event Shared")}
                />
              </Flex>
            </Box>
          </Flex>

          <Box>
            <Table variant="simple" size="md">
              <Tbody>
                <Tr>
                  <Td
                    fontWeight="bold"
                    color="gray.600"
                    fontSize="lg"
                    width="20%"
                    verticalAlign="top"
                    px={0}
                  >
                    <Flex>
                      <Icon as={FaMapMarkerAlt} mr={2} />
                      Location:
                    </Flex>
                  </Td>

                  <Td>
                    <Text
                      color="gray.600"
                      fontSize={{ base: "lg", md: "xl" }}
                      lineHeight="1.2"
                    >
                      Doctors Quarters, <br /> Behind Keffi Hotel, G.R.A, Keffi,
                      Nasarawa State
                    </Text>
                    <Button
                      as="a"
                      href={`https://www.google.com/maps?q=Doctors+Quarters,+Behind+Keffi+Hotel,+G.R.A,+Keffi,+Nasarawa+State`}
                      target="_blank"
                      rel="noopener noreferrer"
                      borderRadius="full"
                      bg="blue.800"
                      color="white"
                      size="sm"
                      mt={2}
                    >
                      View on Map
                    </Button>
                  </Td>
                </Tr>

                {/* Category Row */}
                <Tr>
                  <Td fontWeight="bold" color="gray.600" fontSize="lg" px={0}>
                    <Flex align="center">
                      <Icon as={FaTag} mr={2} />
                      Category:
                    </Flex>
                  </Td>
                  <Td>
                    <Text
                      fontSize="lg"
                      color="gray.600"
                      onClick={() =>
                        navigate(`/category-events/${event.category}`)
                      }
                      _hover={{
                        color: "blue.600",
                        cursor: "pointer",
                      }}
                    >
                      {event.category}
                    </Text>
                  </Td>
                </Tr>

                {/* Organizer Row */}
                <Tr>
                  <Td fontWeight="bold" color="gray.600" fontSize="lg" px={0}>
                    <Flex align="center">
                      <Icon as={FaUsers} mr={2} />
                      Organizer:
                    </Flex>
                  </Td>
                  <Td>
                    <Text
                      fontSize="lg"
                      color="gray.600"
                      onClick={() =>
                        navigate(`/organizer-events/${event.created_by}`)
                      }
                      _hover={{
                        color: "blue.600",
                        cursor: "pointer",
                      }}
                    >
                      User {event.created_by}
                    </Text>
                  </Td>
                </Tr>

                {/* Pricing Row */}
                <Tr>
                  <Td fontWeight="bold" color="gray.600" fontSize="lg" px={0}>
                    <Flex align="center">
                      <Icon as={FaDollarSign} mr={2} />
                      Pricing:
                    </Flex>
                  </Td>
                  <Td>
                    <Text
                      fontSize="lg"
                      color="gray.600"
                      onClick={() =>
                        navigate(`/pricing-events/${event.pricing}`)
                      }
                      _hover={{
                        color: "blue.600",
                        cursor: "pointer",
                      }}
                    >
                      {event.pricing}
                    </Text>
                  </Td>
                </Tr>

                {/* Event Type Row */}
                <Tr>
                  <Td fontWeight="bold" color="gray.600" fontSize="lg" px={0}>
                    <Flex align="center">
                      <Icon as={FaCalendarAlt} mr={2} />
                      Event Type:
                    </Flex>
                  </Td>
                  <Td>
                    <Text fontSize="lg" color="gray.600">
                      {event.event_type
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Text>
                  </Td>
                </Tr>

                {/* Language Row */}
                <Tr>
                  <Td fontWeight="bold" color="gray.600" fontSize="lg" px={0}>
                    <Flex align="center">
                      <Icon as={FaLanguage} mr={2} />
                      Language:
                    </Flex>
                  </Td>
                  <Td>
                    <Text fontSize="lg" color="gray.600">
                      {event.language.charAt(0).toUpperCase() +
                        event.language.slice(1)}
                    </Text>
                  </Td>
                </Tr>

                {/* Age Group Row */}
                <Tr>
                  <Td fontWeight="bold" color="gray.600" fontSize="lg" px={0}>
                    <Flex align="center">
                      <Icon as={FaChild} mr={2} />
                      Age Group:
                    </Flex>
                  </Td>
                  <Td>
                    <Text fontSize="lg" color="gray.600">
                      {event.age_group
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Text>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>

          {/* Event Description */}
          <Text mb={6} fontSize="lg" lineHeight="1.6">
            {event.description}
          </Text>
        </Box>

        <Box>
          <Divider orientation="vertical" />
        </Box>

        {/* Right side content (Sidebar) */}
        <Box flex={{ base: "1", lg: "0.4" }} py={4} borderRadius="md">
          {/* Countdown Timer */}
          <Heading size="md" mb={4}>
            <Flex>
              <Icon as={MdOutlineTimer} boxSize={6} mr={2} />
              Event Starts In:
            </Flex>
          </Heading>
          <Text fontSize="lg">
            {days} Days {hours} Hours {minutes} Minutes {seconds} Seconds
          </Text>

          <Divider my={6} />

          {/* Related Events */}
          <Heading size="md" mb={4}>
            <Flex align="center" justify={{ base: "center", lg: "left" }}>
              <Icon as={FaLink} boxSize={6} mr={2} />
              Related Events
            </Flex>
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 1 }} spacing={4}>
            {relatedEvents.map((relatedEvent) => (
              <Box
                key={relatedEvent.eventid}
                p={4}
                borderWidth={1}
                borderRadius="md"
                boxShadow="sm"
                transition="all 0.2s"
                _hover={{
                  boxShadow: "lg",
                  cursor: "pointer",
                }}
              >
                <Image
                  src={relatedEvent.eventImage}
                  alt={relatedEvent.eventName}
                  borderRadius="md"
                  mb={4}
                  width="100%"
                  objectFit="cover"
                  height="200px"
                />
                <Text fontSize="lg" fontWeight="bold">
                  {relatedEvent.eventName}
                </Text>
                <Text fontSize="md" color="gray.600">
                  {relatedEvent.eventLocation}
                </Text>
                <Button
                  borderColor={detailBorderColor}
                  color={detailColor}
                  variant="outline"
                  size="sm"
                  mt={2}
                  onClick={() => navigate(`/event/${relatedEvent.eventid}`)}
                >
                  View Details
                </Button>
              </Box>
            ))}
          </SimpleGrid>

          <Box width="100%" textAlign="right">
            <Button
              color="blue.800"
              variant="link"
              size="sm"
              mt={4}
              rightIcon={<FaArrowRight />}
              _hover={{
                svg: {
                  transform: "translateX(5px)",
                  transition: "transform 0.3s ease",
                },
              }}
              onClick={() => navigate(`/related-events/${event.category}`)}
            >
              See More
            </Button>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default EventDetail;
