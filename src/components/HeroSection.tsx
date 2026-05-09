import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { useRef } from "react";

interface Props {
  onSearch: (searchText: string) => void;
}

const HeroSection = ({ onSearch }: Props) => {
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.current) onSearch(searchRef.current.value);
  };

  return (
    <Box
      position="relative"
      overflow="hidden"
      bgGradient="linear(135deg, #1E1B4B 0%, #2D1B69 35%, #4C1D95 65%, #1A1035 100%)"
      py={{ base: 16, md: 24, lg: 28 }}
    >
      {/* Decorative blurred orbs */}
      <Box
        className="hero-orb-1"
        position="absolute"
        top="5%"
        right="8%"
        w={{ base: "240px", md: "420px" }}
        h={{ base: "240px", md: "420px" }}
        borderRadius="full"
        bg="rgba(139,92,246,0.18)"
        filter="blur(72px)"
        pointerEvents="none"
      />
      <Box
        className="hero-orb-2"
        position="absolute"
        bottom="-15%"
        left="3%"
        w={{ base: "180px", md: "340px" }}
        h={{ base: "180px", md: "340px" }}
        borderRadius="full"
        bg="rgba(245,158,11,0.12)"
        filter="blur(64px)"
        pointerEvents="none"
      />
      <Box
        className="hero-orb-3"
        position="absolute"
        top="45%"
        left="45%"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="rgba(109,40,217,0.1)"
        filter="blur(90px)"
        pointerEvents="none"
        display={{ base: "none", xl: "block" }}
      />

      {/* Subtle grid pattern overlay */}
      <Box
        position="absolute"
        inset={0}
        opacity={0.03}
        backgroundImage="radial-gradient(circle, #ffffff 1px, transparent 1px)"
        backgroundSize="32px 32px"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={{ base: 7, md: 9 }} textAlign="center" align="center">

          {/* Eyebrow badge */}
          <Badge
            px={4}
            py={1.5}
            borderRadius="full"
            bg="rgba(139,92,246,0.2)"
            color="#C4B5FD"
            border="1px solid rgba(139,92,246,0.35)"
            fontSize="xs"
            fontWeight="600"
            letterSpacing="0.12em"
            textTransform="uppercase"
          >
            ✦ &nbsp;Discover &nbsp;·&nbsp; Experience &nbsp;·&nbsp; Remember
          </Badge>

          {/* Headline */}
          <VStack spacing={4}>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", sm: "5xl", md: "6xl", lg: "7xl" }}
              fontWeight="800"
              lineHeight="1.05"
              letterSpacing="-0.04em"
              color="white"
              maxW="820px"
            >
              Find Events That{" "}
              <Box
                as="span"
                bgGradient="linear(to-r, #C4B5FD, #FBBF24)"
                bgClip="text"
              >
                Move You
              </Box>
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              color="rgba(196,181,253,0.85)"
              maxW="520px"
              lineHeight="1.65"
            >
              Concerts, conferences, workshops, festivals &amp; more — all
              happening near you, all in one place.
            </Text>
          </VStack>

          {/* Search bar */}
          <Box w="100%" maxW="700px">
            <form onSubmit={handleSubmit}>
              <Flex
                bg="white"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="0 24px 64px rgba(0,0,0,0.35)"
                p={{ base: 1.5, md: 2 }}
                gap={2}
                align="center"
              >
                <InputGroup flex={1}>
                  <InputLeftElement pl={2} pointerEvents="none" h="full">
                    <Icon as={FiSearch} color="gray.400" boxSize={5} />
                  </InputLeftElement>
                  <Input
                    ref={searchRef}
                    border="none"
                    bg="transparent"
                    pl={10}
                    placeholder="Search events, artists, venues..."
                    fontSize={{ base: "sm", md: "md" }}
                    color="gray.800"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{ boxShadow: "none" }}
                    h={{ base: "40px", md: "48px" }}
                  />
                </InputGroup>

                {/* Location hint */}
                <HStack
                  spacing={1}
                  px={3}
                  color="gray.400"
                  display={{ base: "none", md: "flex" }}
                  borderLeft="1px solid"
                  borderColor="gray.200"
                  h="28px"
                  flexShrink={0}
                >
                  <Icon as={FiMapPin} boxSize={3.5} />
                  <Text fontSize="sm" whiteSpace="nowrap">
                    Anywhere
                  </Text>
                </HStack>

                <Button
                  type="submit"
                  variant="brand"
                  borderRadius="xl"
                  px={{ base: 5, md: 7 }}
                  flexShrink={0}
                  h={{ base: "40px", md: "48px" }}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Search
                </Button>
              </Flex>
            </form>
          </Box>

          {/* Stats row */}
          <HStack
            spacing={{ base: 8, md: 14 }}
            pt={1}
            wrap="wrap"
            justify="center"
            divider={
              <Box
                w="1px"
                h="32px"
                bg="rgba(139,92,246,0.3)"
                display={{ base: "none", md: "block" }}
              />
            }
          >
            {[
              { number: "10K+", label: "Live Events" },
              { number: "500+", label: "Cities" },
              { number: "2M+", label: "Explorers" },
            ].map(({ number, label }) => (
              <VStack key={label} spacing={0.5}>
                <Text
                  fontWeight="800"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  color="white"
                  lineHeight="1"
                  letterSpacing="-0.04em"
                >
                  {number}
                </Text>
                <Text
                  fontSize="xs"
                  color="rgba(196,181,253,0.7)"
                  fontWeight="500"
                  letterSpacing="0.05em"
                  textTransform="uppercase"
                >
                  {label}
                </Text>
              </VStack>
            ))}
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default HeroSection;
