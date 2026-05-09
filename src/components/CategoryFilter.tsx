import { Box, HStack, Button, Icon, Skeleton, useColorModeValue } from "@chakra-ui/react";
import {
  FiZap, FiHeart, FiMusic, FiMic, FiBookOpen, FiSunrise,
  FiAward, FiMessageCircle, FiStar, FiCamera, FiUsers,
} from "react-icons/fi";
import { useCategories } from "../hooks/useCategories";

const ICON_MAP: Record<string, React.ElementType> = {
  heart:   FiHeart,
  music:   FiMusic,
  mic:     FiMic,
  book:    FiBookOpen,
  sun:     FiSunrise,
  award:   FiAward,
  message: FiMessageCircle,
  users:   FiUsers,
  star:    FiStar,
  camera:  FiCamera,
  zap:     FiZap,
};

interface Props {
  activeCategory?: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ activeCategory = "", onCategoryChange }: Props) => {
  const { categories, loading } = useCategories();
  const bg            = useColorModeValue("white",    "gray.900");
  const borderColor   = useColorModeValue("gray.200", "gray.800");
  const inactiveColor = useColorModeValue("gray.600",  "gray.400");
  const inactiveHoverBg    = useColorModeValue("brand.50",  "gray.800");
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
        {/* "All" pill is always shown */}
        <Button
          size="sm"
          variant={activeCategory === "" ? "brand" : "ghost"}
          leftIcon={<Icon as={FiZap} boxSize={3.5} />}
          borderRadius="full"
          px={4}
          h="34px"
          fontWeight={activeCategory === "" ? "600" : "500"}
          fontSize="sm"
          flexShrink={0}
          color={activeCategory === "" ? "white" : inactiveColor}
          _hover={activeCategory === "" ? {} : { bg: inactiveHoverBg, color: inactiveHoverColor }}
          onClick={() => onCategoryChange("")}
        >
          All
        </Button>

        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} h="34px" w="90px" borderRadius="full" flexShrink={0} />
            ))
          : categories.map(({ slug, name, icon }) => {
              const isActive = activeCategory === slug;
              const IconComp = ICON_MAP[icon] ?? FiZap;
              return (
                <Button
                  key={slug}
                  size="sm"
                  variant={isActive ? "brand" : "ghost"}
                  leftIcon={<Icon as={IconComp} boxSize={3.5} />}
                  borderRadius="full"
                  px={4}
                  h="34px"
                  fontWeight={isActive ? "600" : "500"}
                  fontSize="sm"
                  flexShrink={0}
                  color={isActive ? "white" : inactiveColor}
                  _hover={isActive ? {} : { bg: inactiveHoverBg, color: inactiveHoverColor }}
                  onClick={() => onCategoryChange(slug)}
                >
                  {name}
                </Button>
              );
            })}
      </HStack>
    </Box>
  );
};

export default CategoryFilter;
