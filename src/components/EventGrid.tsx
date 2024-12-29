import { Box, Button, SimpleGrid, useDisclosure, HStack, useColorModeValue, useBreakpointValue } from "@chakra-ui/react";
import EventCard from "./EventCard";
import eventData from "../data/events.json";
import { FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Sidebar from "./SideBar";
import { useState } from "react";

const EventGrid = () => {
  const events = eventData;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = useBreakpointValue({ base: 6, md: 8, lg: 10, xl: 12, "2xl": 15 }) || 10;
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const nextPage = () => {
    if (currentPage < Math.ceil(events.length / eventsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const generatePageNumbers = () => {
    const totalPages = Math.ceil(events.length / eventsPerPage);
    const groupSize = 3;
    const currentGroupStart = Math.floor((currentPage - 1) / groupSize) * groupSize;
    const currentGroupEnd = Math.min(currentGroupStart + groupSize, totalPages);
    
    return Array.from({ length: currentGroupEnd - currentGroupStart }, (_, i) => currentGroupStart + i + 1);
  };


  const buttonBg = useColorModeValue("blue.800", "blue.600"); 
  const buttonTextColor = useColorModeValue("white", "gray.200"); 

  return (
    <>
      <SimpleGrid
        columns={{ base: 1, md: 2, xl: 3, "2xl": 5 }}
        spacing={{base: 4, "2xl": 10}}
        justifyContent="space-around"
        padding="10px"
      >
        <Box w="100%"  display={{ base: "block", md: "none" }}>
          <Button
            variant="outline"
            borderRadius="30px"
            leftIcon={<FaFilter />}
            onClick={onOpen}
            mb={4}
            display={{ base: "block", md: "none" }}
          >
            Filters
          </Button>
          <Sidebar isOpen={isOpen} onClose={onClose} />
        </Box>

        {/* Render paginated events */}
        {currentEvents.map((event, index) => (
          <EventCard
            key={index}
            eventid={event.eventid}
            eventName={event.eventName}
            eventDate={event.eventDate}
            eventLocation={event.eventLocation}
            eventImage={event.eventImage}
            eventCategory={event.eventCategory}
            eventOrganizer={event.eventOrganizer}
            eventPricing={event.eventPricing}
          />
        ))}
      
      </SimpleGrid>

      <HStack w="100%" spacing={4} justify={{base: "center", md: "right"}} mt={4} mr={4}>
        <Button
          onClick={prevPage}
          isDisabled={currentPage === 1}
          bg={buttonBg}
          color={buttonTextColor}
          aria-label="Previous Page"
          borderRadius="full" // Circular button
          padding="12px" // Increase padding for circular shape
        >
          <FaChevronLeft />
        </Button>

        
        {generatePageNumbers().map((page) => (
          <Button
            key={page}
            onClick={() => setCurrentPage(page)}
            isDisabled={page === currentPage}
            variant={page === currentPage ? "solid" : "outline"}
            colorScheme="blue"
            borderRadius="full" 
            padding="12px" 
          >
            {page}
          </Button>
        ))}

        <Button
          onClick={nextPage}
          isDisabled={currentPage === Math.ceil(events.length / eventsPerPage)}
          bg={buttonBg}
          color={buttonTextColor}
          aria-label="Next Page"
          borderRadius="full" 
          padding="12px" 
        >
          <FaChevronRight />
        </Button>
      </HStack>

      
    </>
  );
};

export default EventGrid;
