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
} from "@chakra-ui/react";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaTag,
  FaUserAlt,
} from "react-icons/fa";
import { TbCurrencyNaira } from "react-icons/tb";

interface EventCardProps {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventCategory: string;
  eventOrganizer: string;
  eventPricing: string;
  eventImage: string;
}

const EventCard = ({
  eventName,
  eventDate,
  eventLocation,
  eventCategory,
  eventOrganizer,
  eventPricing,
  eventImage,
}: EventCardProps) => {
  return (
    <Card maxW="sm" borderRadius="md" overflow="hidden" boxShadow="lg">
      <Image src={eventImage} alt={eventName} borderRadius="md" />

      <CardBody>
        <Stack spacing={4}>
          <Heading size="md">{eventName}</Heading>

          {/* HStack for Date and Location with Icons */}
          <HStack spacing={4}>
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

          {/* Category, Organizer, Pricing with Icons */}
          <HStack spacing={4}>
            <HStack spacing={2}>
              <Icon as={FaTag} boxSize={4} />
              <Text fontSize="sm">{eventCategory}</Text>
            </HStack>
            <HStack spacing={2}>
              <Icon as={FaUserAlt} boxSize={4} />
              <Text fontSize="sm" isTruncated maxW="90px">
                {eventOrganizer}
              </Text>
            </HStack>
            <HStack spacing={2}>
              <Icon as={TbCurrencyNaira} boxSize={4} />
              <Text fontSize="sm">{eventPricing}</Text>
            </HStack>
          </HStack>

          <Box textAlign="center" w="100%">
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
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default EventCard;
