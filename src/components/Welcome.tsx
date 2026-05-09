import { Box, Flex, Text, HStack, Icon, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import EventGrid from "./EventGrid";
import HeroSection from "./HeroSection";
import CategoryFilter from "./CategoryFilter";
import { useAuth } from "../contexts/AuthContext";
import { FiCalendar, FiCompass } from "react-icons/fi";

const Welcome = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // Track whether the user has scrolled past the hero zone
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (searchText: string) => {
    // TODO: wire search to EventGrid filtering
    console.log("Search:", searchText);
  };

  const authBannerBg = useColorModeValue("white", "gray.900");
  const authBannerBorder = useColorModeValue("gray.200", "gray.800");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const accentBg = useColorModeValue("brand.50", "gray.800");

  const displayName = user?.first_name
    ? user.first_name
    : user?.email?.split("@")[0] || "there";

  return (
    <Box minH="100vh">
      {isAuthenticated ? (
        /* ── Authenticated view: no hero, just a slim welcome bar ── */
        <>
          <NavBar onSearch={handleSearch} />

          {/* Personalised welcome strip */}
          <Box
            bg={authBannerBg}
            borderBottom="1px solid"
            borderColor={authBannerBorder}
            px={{ base: 4, md: 8, lg: 12 }}
            py={4}
          >
            <HStack justify="space-between" wrap="wrap" gap={3}>
              <HStack spacing={3}>
                <Box
                  w="36px" h="36px" borderRadius="full" bg={accentBg}
                  display="flex" alignItems="center" justifyContent="center"
                  flexShrink={0}
                >
                  <Icon as={FiCompass} boxSize={4} color="brand.500" />
                </Box>
                <Box>
                  <Text fontWeight="700" fontSize="sm" letterSpacing="-0.01em">
                    Welcome back, {displayName} 👋
                  </Text>
                  <Text fontSize="xs" color={mutedColor}>
                    Here's what's happening today
                  </Text>
                </Box>
              </HStack>
              <HStack spacing={2} color={mutedColor} fontSize="xs">
                <Icon as={FiCalendar} boxSize={3.5} />
                <Text>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</Text>
              </HStack>
            </HStack>
          </Box>

          <CategoryFilter />
        </>
      ) : (
        /* ── Guest view: full hero with transparent-then-frosted navbar ── */
        <>
          {/* Shared dark gradient backdrop — covers navbar + hero as one visual unit */}
          <Box bgGradient="linear(135deg, #1E1B4B 0%, #2D1B69 35%, #4C1D95 65%, #1A1035 100%)">
            <NavBar onSearch={handleSearch} transparent={!scrolled} />
            <HeroSection onSearch={handleSearch} />
          </Box>
          <CategoryFilter />
        </>
      )}

      {/* Main content — sidebar + grid */}
      <Box maxW="container.2xl" mx="auto" px={{ base: 4, md: 6, lg: 8 }} py={8}>
        <Flex gap={8} align="flex-start">
          {/* Sidebar — desktop only */}
          <Box
            display={{ base: "none", lg: "block" }}
            w="272px"
            flexShrink={0}
            position="sticky"
            top="80px"
            maxH="calc(100vh - 96px)"
            overflowY="auto"
            className="no-scrollbar"
          >
            <SideBar isOpen={false} onClose={() => {}} />
          </Box>

          {/* Event grid */}
          <Box flex={1} minW={0}>
            <EventGrid />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Welcome;
