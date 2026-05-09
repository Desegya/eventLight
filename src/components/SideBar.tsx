import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
  Flex,
  Text,
  useBreakpointValue,
  Checkbox,
  CheckboxGroup,
  VStack,
  Select,
  Button,
  HStack,
  Icon,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiMapPin,
  FiTag,
  FiUsers,
  FiGlobe,
  FiDollarSign,
  FiSliders,
  FiX,
} from "react-icons/fi";
import { useState } from "react";

const CATEGORIES = ["Music", "Sports", "Conferences", "Workshops", "Tech", "Arts"];
const DATE_OPTIONS = ["Today", "This Week", "This Weekend", "This Month", "Upcoming"];
const LOCATIONS = ["New York", "Los Angeles", "Chicago", "Houston", "Online"];
const EVENT_TYPES = ["Concert", "Seminar", "Workshop", "Retreat", "Meetup"];
const AGE_GROUPS = ["Family", "Youth", "Adults", "Seniors", "All Ages"];
const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarContent = ({ onClear }: { onClear: () => void }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);

  const headingColor = useColorModeValue("gray.900", "white");
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const selectBg = useColorModeValue("white", "gray.700");

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedDate("");
    setSelectedLocation("");
    setSelectedEventTypes([]);
    setSelectedAgeGroups([]);
    setSelectedLanguage("");
    setSelectedPricing([]);
    onClear();
  };

  const activeCount =
    selectedCategories.length +
    selectedEventTypes.length +
    selectedAgeGroups.length +
    selectedPricing.length +
    (selectedDate ? 1 : 0) +
    (selectedLocation ? 1 : 0) +
    (selectedLanguage ? 1 : 0);

  return (
    <Box w="full" pb={6}>
      {/* Header */}
      <Flex align="center" justify="space-between" mb={5}>
        <HStack spacing={2}>
          <Icon as={FiSliders} boxSize={4} color="brand.500" />
          <Text fontWeight="700" fontSize="md" color={headingColor}>
            Filter Events
          </Text>
          {activeCount > 0 && (
            <Box
              bg="brand.600"
              color="white"
              borderRadius="full"
              px={2}
              py={0.5}
              fontSize="xs"
              fontWeight="700"
              lineHeight="1.4"
            >
              {activeCount}
            </Box>
          )}
        </HStack>
        {activeCount > 0 && (
          <Button
            size="xs"
            variant="ghost"
            color={mutedColor}
            leftIcon={<FiX size={12} />}
            onClick={handleClearAll}
            borderRadius="full"
            _hover={{ color: "red.400", bg: "red.50" }}
          >
            Clear all
          </Button>
        )}
      </Flex>

      <VStack align="stretch" spacing={5}>
        {/* Categories */}
        <Box>
          <HStack spacing={2} mb={3}>
            <Icon as={FiTag} boxSize={3.5} color="brand.500" />
            <Text fontSize="xs" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="0.08em">
              Category
            </Text>
          </HStack>
          <CheckboxGroup
            value={selectedCategories}
            onChange={(v) => setSelectedCategories(v as string[])}
          >
            <VStack align="stretch" spacing={2}>
              {CATEGORIES.map((cat) => (
                <Checkbox
                  key={cat}
                  value={cat}
                  colorScheme="brand"
                  size="sm"
                >
                  <Text fontSize="sm" color={labelColor} fontWeight="500">{cat}</Text>
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </Box>

        <Divider borderColor={borderColor} />

        {/* Date */}
        <Box>
          <HStack spacing={2} mb={3}>
            <Icon as={FiCalendar} boxSize={3.5} color="brand.500" />
            <Text fontSize="xs" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="0.08em">
              Date
            </Text>
          </HStack>
          <Select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="Any time"
            size="sm"
            borderRadius="lg"
            bg={selectBg}
            borderColor={borderColor}
            fontSize="sm"
            _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 3px rgba(139,92,246,0.15)" }}
          >
            {DATE_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>
        </Box>

        <Divider borderColor={borderColor} />

        {/* Location */}
        <Box>
          <HStack spacing={2} mb={3}>
            <Icon as={FiMapPin} boxSize={3.5} color="brand.500" />
            <Text fontSize="xs" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="0.08em">
              Location
            </Text>
          </HStack>
          <Select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            placeholder="Anywhere"
            size="sm"
            borderRadius="lg"
            bg={selectBg}
            borderColor={borderColor}
            fontSize="sm"
            _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 3px rgba(139,92,246,0.15)" }}
          >
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </Select>
        </Box>

        <Divider borderColor={borderColor} />

        {/* Pricing */}
        <Box>
          <HStack spacing={2} mb={3}>
            <Icon as={FiDollarSign} boxSize={3.5} color="brand.500" />
            <Text fontSize="xs" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="0.08em">
              Pricing
            </Text>
          </HStack>
          <CheckboxGroup
            value={selectedPricing}
            onChange={(v) => setSelectedPricing(v as string[])}
          >
            <HStack spacing={4}>
              <Checkbox value="free" colorScheme="brand" size="sm">
                <Text fontSize="sm" color={labelColor} fontWeight="500">Free</Text>
              </Checkbox>
              <Checkbox value="paid" colorScheme="brand" size="sm">
                <Text fontSize="sm" color={labelColor} fontWeight="500">Paid</Text>
              </Checkbox>
            </HStack>
          </CheckboxGroup>
        </Box>

        <Divider borderColor={borderColor} />

        {/* Event Type */}
        <Box>
          <HStack spacing={2} mb={3}>
            <Icon as={FiUsers} boxSize={3.5} color="brand.500" />
            <Text fontSize="xs" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="0.08em">
              Event Type
            </Text>
          </HStack>
          <CheckboxGroup
            value={selectedEventTypes}
            onChange={(v) => setSelectedEventTypes(v as string[])}
          >
            <VStack align="stretch" spacing={2}>
              {EVENT_TYPES.map((t) => (
                <Checkbox key={t} value={t} colorScheme="brand" size="sm">
                  <Text fontSize="sm" color={labelColor} fontWeight="500">{t}</Text>
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </Box>

        <Divider borderColor={borderColor} />

        {/* Age Group */}
        <Box>
          <HStack spacing={2} mb={3}>
            <Icon as={FiUsers} boxSize={3.5} color="brand.500" />
            <Text fontSize="xs" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="0.08em">
              Age Group
            </Text>
          </HStack>
          <CheckboxGroup
            value={selectedAgeGroups}
            onChange={(v) => setSelectedAgeGroups(v as string[])}
          >
            <VStack align="stretch" spacing={2}>
              {AGE_GROUPS.map((g) => (
                <Checkbox key={g} value={g} colorScheme="brand" size="sm">
                  <Text fontSize="sm" color={labelColor} fontWeight="500">{g}</Text>
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </Box>

        <Divider borderColor={borderColor} />

        {/* Language */}
        <Box>
          <HStack spacing={2} mb={3}>
            <Icon as={FiGlobe} boxSize={3.5} color="brand.500" />
            <Text fontSize="xs" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="0.08em">
              Language
            </Text>
          </HStack>
          <Select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            placeholder="Any language"
            size="sm"
            borderRadius="lg"
            bg={selectBg}
            borderColor={borderColor}
            fontSize="sm"
            _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 3px rgba(139,92,246,0.15)" }}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </Select>
        </Box>

        {/* Apply button */}
        <Button variant="brand" borderRadius="xl" size="sm" w="full" mt={2}>
          Apply Filters
        </Button>
      </VStack>
    </Box>
  );
};

const Sidebar = ({ isOpen, onClose }: Props) => {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const drawerBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
        <DrawerOverlay backdropFilter="blur(4px)" bg="blackAlpha.300" />
        <DrawerContent bg={drawerBg} borderRight="1px solid" borderColor={borderColor}>
          <DrawerCloseButton mt={3} />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor} pb={4} pt={5} fontSize="md">
            Filters
          </DrawerHeader>
          <DrawerBody px={5} py={5} overflowY="auto">
            <SidebarContent onClear={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Box
      borderRadius="2xl"
      border="1px solid"
      borderColor={borderColor}
      bg={useColorModeValue("white", "gray.800")}
      p={5}
    >
      <SidebarContent onClear={() => {}} />
    </Box>
  );
};

export default Sidebar;
