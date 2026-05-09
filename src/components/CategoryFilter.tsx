import { Box, HStack, Button, Icon, useColorModeValue } from "@chakra-ui/react";
import {
  FiZap, FiMusic, FiUsers, FiBookOpen, FiMic,
  FiHeart, FiStar, FiSunrise, FiMessageCircle, FiAward,
} from "react-icons/fi";

const CATEGORIES = [
  { label: "All",        value: "",           icon: FiZap         },
  { label: "Worship",    value: "worship",    icon: FiHeart       },
  { label: "Music",      value: "music",      icon: FiMusic       },
  { label: "Conference", value: "conference", icon: FiMic         },
  { label: "Seminar",    value: "seminar",    icon: FiBookOpen    },
  { label: "Fellowship", value: "fellowship", icon: FiUsers       },
  { label: "Prayer",     value: "prayer",     icon: FiSunrise     },
  { label: "Youth",      value: "youth",      icon: FiAward       },
  { label: "Outreach",   value: "outreach",   icon: FiMessageCircle },
  { label: "Teaching",   value: "teaching",   icon: FiStar        },
];

interface Props {
  activeCategory?: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ activeCategory = "", onCategoryChange }: Props) => {
  const bg          = useColorModeValue("white",    "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const inactiveColor     = useColorModeValue("gray.600",  "gray.400");
  const inactiveHoverBg   = useColorModeValue("brand.50",  "gray.800");
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
        {CATEGORIES.map(({ label, value, icon }) => {
          const isActive = activeCategory === value;
          return (
            <Button
              key={value}
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
              _hover={isActive ? {} : { bg: inactiveHoverBg, color: inactiveHoverColor }}
              onClick={() => onCategoryChange(value)}
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
