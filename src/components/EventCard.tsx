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
import { Link } from "react-router-dom"; // Import Link component

interface EventCardProps {
  eventid: number; // Add eventid to the props
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventCategory: string;
  eventOrganizer: string;
  eventPricing: string;
  eventImage: string;
}

const EventCard = ({
  eventid,
  eventName,
  eventDate,
  eventLocation,
  eventCategory,
  eventOrganizer,
  eventPricing,
  eventImage,
}: EventCardProps) => {
  const isFree = eventPricing.toLowerCase() === "free";

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
        <Tooltip label="Like this event" fontSize="sm">
          <Box
            as="button"
            p={2}
            borderRadius="full"
            _hover={{ bg: hoverBg }}
          >
            <Icon as={FaHeart} boxSize={4} color={iconColor} />
          </Box>
        </Tooltip>
        <Tooltip label="Save this event" fontSize="sm">
          <Box
            as="button"
            p={2}
            borderRadius="full"
            _hover={{ bg: hoverBg }}
          >
            <Icon as={FaBookmark} boxSize={4} color={iconColor} />
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
        <Image src={eventImage} alt={eventName} borderRadius="md" />

        <CardBody>
          <Stack spacing={4}>
            {/* Event Name with Pricing Button */}
            <HStack justifyContent="left" alignItems="center" gap={6}>
              <Heading size="md">{eventName}</Heading>
              <Button
                size="xs"
                bg={priceButtonBg}
                color="white"
                _hover={{ bg: priceButtonHover }}
                leftIcon={
                  isFree ? <Icon as={FaCheckCircle} /> : <Icon as={TbCurrencyNaira} />
                }
              >
                {isFree ? "Free" : "Paid"}
              </Button>
            </HStack>

            {/* HStack for Date and Location with Icons */}
            <HStack spacing={4} color={detailColor}>
              <HStack spacing={2}>
                <Icon as={FaCalendar} boxSize={4} />
                <Text fontSize="sm">{eventDate}</Text>
              </HStack>
              <Divider orientation="vertical" />
              <HStack spacing={2}>
                <Icon as={FaMapMarkerAlt} boxSize={4} />
                <Text fontSize="sm">{eventLocation}</Text>
              </HStack>
            </HStack>

            {/* Category and Organizer */}
            <HStack spacing={4} color={detailColor}>
              <HStack spacing={2}>
                <Icon as={FaTag} boxSize={4} />
                <Text fontSize="sm">{eventCategory}</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FaUserAlt} boxSize={4} />
                <Text fontSize="sm" isTruncated maxW="150px">
                  {eventOrganizer}
                </Text>
              </HStack>
            </HStack>

            {/* View Details Button - Using Link for Navigation */}
            <Box textAlign="center" w="100%">
              <Link to={`/events/${eventid}`}>
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
