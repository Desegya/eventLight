import { Box, Flex } from "@chakra-ui/react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import EventGrid from "./EventGrid";
import HeroSection from "./HeroSection";
import CategoryFilter from "./CategoryFilter";

const Welcome = () => {
  const handleSearch = (searchText: string) => {
    // TODO: wire up search to EventGrid filtering
    console.log("Search:", searchText);
  };

  return (
    <Box minH="100vh">
      <NavBar onSearch={handleSearch} />
      <HeroSection onSearch={handleSearch} />
      <CategoryFilter />

      <Box maxW="container.2xl" mx="auto" px={{ base: 4, md: 6, lg: 8 }} py={8}>
        <Flex gap={8} align="flex-start">
          {/* Sidebar — desktop only */}
          <Box
            display={{ base: "none", lg: "block" }}
            w="272px"
            flexShrink={0}
            position="sticky"
            top="112px"
            maxH="calc(100vh - 128px)"
            overflowY="auto"
            className="no-scrollbar"
          >
            <SideBar isOpen={false} onClose={() => {}} />
          </Box>

          {/* Main event grid */}
          <Box flex={1} minW={0}>
            <EventGrid />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Welcome;
