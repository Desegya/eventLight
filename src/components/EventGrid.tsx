import {
  Box,
  Button,
  SimpleGrid,
  useDisclosure,
  HStack,
  useColorModeValue,
  Spinner,
  Center,
  Text,
  Flex,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import EventCard from "./EventCard";
import { FiFilter, FiChevronLeft, FiChevronRight, FiAlertCircle } from "react-icons/fi";
import Sidebar from "./SideBar";
import { useEvents } from "../hooks/useEvents";
import { EventFilters } from "../types/event";

const PAGE_SIZE = 12;

interface Props {
  filters: EventFilters;
  onFiltersChange: (patch: Partial<EventFilters>) => void;
}

const EventGrid = ({ filters, onFiltersChange }: Props) => {
  const { events, totalCount, loading, error } = useEvents(filters);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = filters.page ?? 1;

  const mutedColor     = useColorModeValue("gray.500", "gray.400");
  const borderColor    = useColorModeValue("gray.200", "gray.700");
  const pillActiveBg   = useColorModeValue("brand.600", "brand.500");
  const pillInactiveBg = useColorModeValue("white",    "gray.800");
  const pillBorder     = useColorModeValue("gray.200", "gray.700");

  const setPage = (p: number) => onFiltersChange({ page: p });

  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  if (loading) {
    return (
      <Center h="320px" flexDirection="column" gap={4}>
        <Spinner size="xl" color="brand.500" thickness="3px" speed="0.7s" emptyColor="gray.200" />
        <Text color={mutedColor} fontSize="sm" fontWeight="500">Loading events…</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="320px" flexDirection="column" gap={3}>
        <Icon as={FiAlertCircle} boxSize={10} color="red.400" />
        <Text fontWeight="600" color="red.400">Something went wrong</Text>
        <Text fontSize="sm" color={mutedColor}>{error}</Text>
      </Center>
    );
  }

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end   = Math.min(currentPage * PAGE_SIZE, totalCount);

  return (
    <Box>
      {/* Mobile filter trigger */}
      <Box display={{ base: "block", lg: "none" }} mb={5}>
        <Button
          variant="brand-outline"
          size="sm"
          borderRadius="full"
          leftIcon={<Icon as={FiFilter} boxSize={3.5} />}
          onClick={onOpen}
          px={4}
        >
          Filters
        </Button>
        <Sidebar isOpen={isOpen} onClose={onClose} filters={filters} onFiltersChange={onFiltersChange} />
      </Box>

      {/* Results count */}
      <Flex align="center" justify="space-between" mb={5}>
        <Text fontSize="sm" fontWeight="600" color={mutedColor}>
          {totalCount > 0
            ? `Showing ${start}–${end} of ${totalCount} event${totalCount !== 1 ? "s" : ""}`
            : "No events found"}
        </Text>
      </Flex>

      {/* Grid */}
      {events.length === 0 ? (
        <Center h="240px" flexDirection="column" gap={3}>
          <Text fontSize="xl" fontWeight="700" color={mutedColor}>No events found</Text>
          <Text fontSize="sm" color={mutedColor}>Try adjusting your search or filters.</Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} spacing={{ base: 4, md: 5 }} mb={8}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </SimpleGrid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Flex align="center" justify="center" gap={2} pt={4}>
          <IconButton
            aria-label="Previous page"
            icon={<FiChevronLeft />}
            size="sm"
            borderRadius="full"
            variant="outline"
            borderColor={borderColor}
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            isDisabled={currentPage === 1}
            _hover={{ borderColor: "brand.500", color: "brand.500" }}
          />

          <HStack spacing={1}>
            {getVisiblePages().map((page) => {
              const isActive = page === currentPage;
              return (
                <Box
                  key={page}
                  as="button"
                  onClick={() => setPage(page)}
                  w="32px" h="32px"
                  borderRadius="full"
                  display="flex" alignItems="center" justifyContent="center"
                  fontSize="sm"
                  fontWeight={isActive ? "700" : "500"}
                  bg={isActive ? pillActiveBg : pillInactiveBg}
                  color={isActive ? "white" : mutedColor}
                  border="1px solid"
                  borderColor={isActive ? "brand.600" : pillBorder}
                  _hover={isActive ? {} : { borderColor: "brand.400", color: "brand.600" }}
                  transition="all 0.15s ease"
                >
                  {page}
                </Box>
              );
            })}
          </HStack>

          <IconButton
            aria-label="Next page"
            icon={<FiChevronRight />}
            size="sm"
            borderRadius="full"
            variant="outline"
            borderColor={borderColor}
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            isDisabled={currentPage === totalPages}
            _hover={{ borderColor: "brand.500", color: "brand.500" }}
          />
        </Flex>
      )}
    </Box>
  );
};

export default EventGrid;
