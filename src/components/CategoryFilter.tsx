import {
  Box,
  HStack,
  Button,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiZap,
  FiMusic,
  FiCode,
  FiUsers,
  FiBookOpen,
  FiMic,
  FiStar,
  FiCoffee,
  FiCamera,
  FiActivity,
} from "react-icons/fi";
import { useState } from "react";

const CATEGORIES = [
  { label: "All", icon: FiZap },
  { label: "Music", icon: FiMusic },
  { label: "Tech", icon: FiCode },
  { label: "Sports", icon: FiActivity },
  { label: "Workshops", icon: FiBookOpen },
  { label: "Conferences", icon: FiMic },
  { label: "Social", icon: FiCoffee },
  { label: "Community", icon: FiUsers },
  { label: "Arts", icon: FiCamera },
  { label: "Featured", icon: FiStar },
];

interface Props {
  onCategoryChange?: (category: string) => void;
}

const CategoryFilter = ({ onCategoryChange }: Props) => {
  const [active, setActive] = useState("All");

  const bg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const inactiveColor = useColorModeValue("gray.600", "gray.400");
  const inactiveHoverBg = useColorModeValue("brand.50", "gray.800");
  const inactiveHoverColor = useColorModeValue("brand.700", "brand.300");

  return (
    <Box
      bg={bg}
      borderBottom="1px solid"
      borderColor={borderColor}
      overflowX="auto"
      className="no-scrollbar"
      position="sticky"
      top="60px"
      zIndex={50}
    >
      <HStack
        spacing={1}
        px={{ base: 4, md: 8, lg: 12 }}
        py={2.5}
        maxW="container.2xl"
        mx="auto"
        w="max-content"
        minW="full"
      >
        {CATEGORIES.map(({ label, icon }) => {
          const isActive = active === label;
          return (
            <Button
              key={label}
              size="sm"
              variant={isActive ? "brand" : "ghost"}
              leftIcon={<Icon as={icon} boxSize={3.5} />}
              borderRadius="full"
              px={4}
              h="34px"
              fontWeight={isActive ? "600" : "500"}
              fontSize="sm"
              flexShrink={0}
              color={isActive ? "white" : inactiveColor}
              _hover={
                isActive
                  ? {}
                  : { bg: inactiveHoverBg, color: inactiveHoverColor }
              }
              onClick={() => {
                setActive(label);
                onCategoryChange?.(label);
              }}
            >
              {label}
            </Button>
          );
        })}
      </HStack>
    </Box>
  );
};

export default CategoryFilter;
