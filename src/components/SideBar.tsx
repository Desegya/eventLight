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
  FiUsers,
  FiGlobe,
  FiDollarSign,
  FiSliders,
  FiX,
  FiArrowUpRight,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { EventFilters } from "../types/event";

const AGE_GROUPS = [
  { label: "All Ages",      value: "all_ages"     },
  { label: "Children",      value: "children"     },
  { label: "Teenagers",     value: "teenagers"    },
  { label: "Young Adults",  value: "young_adults" },
  { label: "Adults",        value: "adults"       },
  { label: "Seniors",       value: "seniors"      },
];

const LANGUAGES = [
  { label: "English",       value: "english"      },
  { label: "Yoruba",        value: "yoruba"       },
  { label: "Igbo",          value: "igbo"         },
  { label: "Hausa",         value: "hausa"        },
  { label: "Pidgin",        value: "pidgin"       },
  { label: "French",        value: "french"       },
  { label: "Multilingual",  value: "multilingual" },
];

const SORT_OPTIONS = [
  { label: "Soonest first",  value: "date"        },
  { label: "Latest first",   value: "-date"       },
  { label: "Newest added",   value: "-created_at" },
  { label: "A → Z",          value: "title"       },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: EventFilters;
  onFiltersChange: (patch: Partial<EventFilters>) => void;
}

const SidebarContent = ({
  filters,
  onFiltersChange,
  onClose,
}: {
  filters: EventFilters;
  onFiltersChange: (patch: Partial<EventFilters>) => void;
  onClose?: () => void;
}) => {
  // Local draft — only committed on "Apply"
  const [pricing,   setPricing]   = useState<string>(filters.pricing   ?? "");
  const [language,  setLanguage]  = useState<string>(filters.language  ?? "");
  const [ageGroup,  setAgeGroup]  = useState<string>(filters.age_group ?? "");
  const [ordering,  setOrdering]  = useState<string>(filters.ordering  ?? "");

  // Stay in sync if parent clears filters externally
  useEffect(() => {
    setPricing(filters.pricing   ?? "");
    setLanguage(filters.language  ?? "");
    setAgeGroup(filters.age_group ?? "");
    setOrdering(filters.ordering  ?? "");
  }, [filters.pricing, filters.language, filters.age_group, filters.ordering]);

  const headingColor = useColorModeValue("gray.900", "white");
  const labelColor   = useColorModeValue("gray.700", "gray.300");
  const mutedColor   = useColorModeValue("gray.500", "gray.400");
  const borderColor  = useColorModeValue("gray.200", "gray.700");
  const selectBg     = useColorModeValue("white",    "gray.700");

  const activeCount =
    (pricing   ? 1 : 0) +
    (language  ? 1 : 0) +
    (ageGroup  ? 1 : 0) +
    (ordering  ? 1 : 0);

  const handleClear = () => {
    setPricing(""); setLanguage(""); setAgeGroup(""); setOrdering("");
    onFiltersChange({ pricing: undefined, language: undefined, age_group: undefined, ordering: undefined, page: 1 });
  };

  const handleApply = () => {
    onFiltersChange({
      pricing:   pricing   || undefined,
      language:  language  || undefined,
      age_group: ageGroup  || undefined,
      ordering:  ordering  || undefined,
      page: 1,
    });
    onClose?.();
  };

  return (
    <Box w="full" pb={6}>
      {/* Header */}
      <Flex align="center" justify="space-between" mb={5}>
        <HStack spacing={2}>
          <Icon as={FiSliders} boxSize={4} color="brand.500" />
          <Text fontWeight="700" fontSize="md" color={headingColor}>Filter Events</Text>
          {activeCount > 0 && (
            <Box
              bg="brand.600" color="white" borderRadius="full"
              px={2} py={0.5} fontSize="xs" fontWeight="700" lineHeight="1.4"
            >
              {activeCount}
            </Box>
          )}
        </HStack>
        {activeCount > 0 && (
          <Button
            size="xs" variant="ghost" color={mutedColor}
            leftIcon={<FiX size={12} />}
            onClick={handleClear} borderRadius="full"
            _hover={{ color: "red.400", bg: "red.50" }}
          >
            Clear all
          </Button>
        )}
      </Flex>

      <VStack align="stretch" spacing={5}>

        {/* Sort */}
        <Box>
          <Text fontSize="xs" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="0.08em" mb={3}>
            Sort by
          </Text>
          <Select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            placeholder="Default order"
            size="sm" borderRadius="lg"
            bg={selectBg} borderColor={borderColor} fontSize="sm"
            _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 3px rgba(139,92,246,0.15)" }}
          >
            {SORT_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
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
            value={pricing ? [pricing] : []}
            onChange={(v) => setPricing((v as string[])[v.length - 1] ?? "")}
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

        {/* Language */}
        <Box>
          <HStack spacing={2} mb={3}>
            <Icon as={FiGlobe} boxSize={3.5} color="brand.500" />
            <Text fontSize="xs" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="0.08em">
              Language
            </Text>
          </HStack>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Any language"
            size="sm" borderRadius="lg"
            bg={selectBg} borderColor={borderColor} fontSize="sm"
            _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 3px rgba(139,92,246,0.15)" }}
          >
            {LANGUAGES.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
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
          <Select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            placeholder="All ages"
            size="sm" borderRadius="lg"
            bg={selectBg} borderColor={borderColor} fontSize="sm"
            _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 3px rgba(139,92,246,0.15)" }}
          >
            {AGE_GROUPS.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </Box>

        {/* Apply */}
        <Button
          variant="brand" borderRadius="xl" size="sm" w="full" mt={2}
          rightIcon={<FiArrowUpRight size={14} />}
          onClick={handleApply}
        >
          Apply Filters
        </Button>
      </VStack>
    </Box>
  );
};

const Sidebar = ({ isOpen, onClose, filters, onFiltersChange }: Props) => {
  const isMobile    = useBreakpointValue({ base: true, lg: false });
  const drawerBg    = useColorModeValue("white",    "gray.900");
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
            <SidebarContent filters={filters} onFiltersChange={onFiltersChange} onClose={onClose} />
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
      <SidebarContent filters={filters} onFiltersChange={onFiltersChange} />
    </Box>
  );
};

export default Sidebar;
