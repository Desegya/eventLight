import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useBreakpointValue,
  Checkbox,
  CheckboxGroup,
  VStack,
  Select,
  DrawerCloseButton,

} from "@chakra-ui/react";
import {

  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaLanguage,
  FaChurch,
  FaDollarSign,

} from "react-icons/fa"; // Import icons
import { BiCategoryAlt } from "react-icons/bi";
import { useState } from "react";

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedEventType, setSelectedEventType] = useState<string[]>([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState<string[]>([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const categories = ["Music", "Sports", "Conferences", "Workshops"];
  const dates = ["This Week", "This Month", "Upcoming"];
  const locations = ["New York", "Los Angeles", "Chicago", "Online"];
  const eventTypes = ["Worship", "Concerts", "Seminars", "Retreats"];
  const organizers = ["Church A", "Church B", "Church C"];
  const ageGroups = ["Family", "Youth", "Adults", "Seniors"];
  const languages = ["English", "Spanish", "French"];

  const SidebarContent = () => (
    <Box w={{base: "full", md: "200px", lg: "300px"}} p={4} height="100vh" overflowY="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Filter Events
      </Text>

      <VStack align="start" mb={6}>
        <Flex align="center">
          <BiCategoryAlt />
          <Text ml={2} fontSize="lg" fontWeight="semibold">
            Categories
          </Text>
        </Flex>
        <CheckboxGroup
          value={selectedCategories}
          onChange={(value) => setSelectedCategories(value as string[])}
        >
          {categories.map((category) => (
            <Checkbox key={category} value={category}>
              {category}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </VStack>

      <VStack align="start" mb={6}>
        <Flex align="center">
          <FaCalendarAlt />
          <Text ml={2} fontSize="lg" fontWeight="semibold">
            Date
          </Text>
        </Flex>
        <Select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          placeholder="Select date range"
        >
          {dates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </Select>
      </VStack>

      {/* Location Filter */}
      <VStack align="start" mb={6}>
        <Flex align="center">
          <FaMapMarkerAlt />
          <Text ml={2} fontSize="lg" fontWeight="semibold">
            Location
          </Text>
        </Flex>
        <Select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          placeholder="Select location"
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </Select>
      </VStack>

      {/* Event Type Filter */}
      <VStack align="start" mb={6}>
        <Flex align="center">
          <FaUsers />
          <Text ml={2} fontSize="lg" fontWeight="semibold">
            Event Type
          </Text>
        </Flex>
        <CheckboxGroup
          value={selectedEventType}
          onChange={(value) => setSelectedEventType(value as string[])}
        >
          {eventTypes.map((type) => (
            <Checkbox key={type} value={type}>
              {type}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </VStack>

      {/* Event Organizer Filter */}
      <VStack align="start" mb={6}>
        <Flex align="center">
          <FaChurch />
          <Text ml={2} fontSize="lg" fontWeight="semibold">
            Event Organizer
          </Text>
        </Flex>
        <CheckboxGroup
          value={selectedOrganizer}
          onChange={(value) => setSelectedOrganizer(value as string[])}
        >
          {organizers.map((organizer) => (
            <Checkbox key={organizer} value={organizer}>
              {organizer}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </VStack>

      {/* Age Group Filter */}
      <VStack align="start" mb={6}>
        <Flex align="center">
          <FaUsers />
          <Text ml={2} fontSize="lg" fontWeight="semibold">
            Age Group
          </Text>
        </Flex>
        <CheckboxGroup value={selectedAgeGroup} onChange={(value) => setSelectedAgeGroup(value as string[])}>
          {ageGroups.map((group) => (
            <Checkbox key={group} value={group}>
              {group}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </VStack>

      {/* Language Filter */}
      <VStack align="start" mb={6}>
        <Flex align="center">
          <FaLanguage />
          <Text ml={2} fontSize="lg" fontWeight="semibold">
            Language
          </Text>
        </Flex>
        <Select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          placeholder="Select language"
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </Select>
      </VStack>

      {/* Pricing Filter */}
      <VStack align="start" mb={6}>
        <Flex align="center">
          <FaDollarSign />
          <Text ml={2} fontSize="lg" fontWeight="semibold">
            Pricing
          </Text>
        </Flex>
        <CheckboxGroup
          value={selectedCategories}
          onChange={(value) => setSelectedCategories(value as string[])}
        >
          <Checkbox value="Paid">Paid</Checkbox>
          <Checkbox value="Free">Free</Checkbox>
        </CheckboxGroup>
      </VStack>
    </Box>
  );

  return (
    <Flex>
     {isMobile ? (
        <>
        
          

          {/* Drawer for Filters */}
          <Drawer isOpen={isOpen} onClose={onClose}>
            <DrawerOverlay>
              <DrawerContent>
              <DrawerCloseButton />
                <DrawerHeader>Event Filters</DrawerHeader>
                <DrawerBody>
                  <SidebarContent />
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      ) : (
        <SidebarContent />
      )}
    </Flex>
  );
};

export default Sidebar;
