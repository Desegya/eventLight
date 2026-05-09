import {
  Box,
  Flex,
  HStack,
  Image,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerOverlay,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  VStack,
  Divider,
  Icon,
  Badge,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiHeart,
  FiBookmark,
  FiSettings,
  FiLogOut,
  FiBell,
  FiClipboard,
  FiSearch,
  FiMenu,
  FiMoon,
  FiSun,
  FiLogIn,
} from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRef } from "react";

interface Props {
  onSearch: (searchText: string) => void;
  transparent?: boolean;
}

const NavBar = ({ onSearch, transparent = false }: Props) => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  const isAuthenticated = !!user;

  // When transparent (over hero), everything uses light-on-dark styling.
  // When opaque, use the normal frosted-glass appearance.
  const navBg = transparent
    ? "transparent"
    : useColorModeValue("rgba(255,255,255,0.88)", "rgba(15,23,42,0.88)");
  const borderColor = transparent
    ? "transparent"
    : useColorModeValue("gray.200", "gray.800");
  const wordmarkColor = transparent ? "white" : useColorModeValue("gray.900", "white");
  const inputBg = transparent
    ? "rgba(255,255,255,0.12)"
    : useColorModeValue("gray.100", "gray.800");
  const inputHoverBg = transparent
    ? "rgba(255,255,255,0.18)"
    : useColorModeValue("gray.200", "gray.700");
  const mutedColor = transparent ? "rgba(255,255,255,0.65)" : useColorModeValue("gray.600", "gray.400");
  const menuBg = useColorModeValue("white", "gray.800");
  const menuBorder = useColorModeValue("gray.200", "gray.700");
  const menuHoverBg = useColorModeValue("gray.50", "gray.700");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.current) onSearch(searchRef.current.value);
  };

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={100}
      bg={navBg}
      backdropFilter={transparent ? "none" : "blur(20px)"}
      sx={{ WebkitBackdropFilter: transparent ? "none" : "blur(20px)" }}
      borderBottom="1px solid"
      borderColor={borderColor}
      transition="background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease"
    >
      <Flex
        maxW="container.2xl"
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}
        py={3}
        align="center"
        gap={{ base: 3, md: 4 }}
      >
        {/* Logo */}
        <Link to="/">
          <HStack spacing={2.5} align="center" flexShrink={0}>
            <Image
              src={logo}
              h={{ base: "28px", md: "30px" }}
              w={{ base: "28px", md: "30px" }}
              alt="EventLight icon"
              transition="opacity 0.2s"
              _hover={{ opacity: 0.85 }}
            />
            <Text
              fontWeight="800"
              fontSize={{ base: "lg", md: "xl" }}
              letterSpacing="-0.04em"
              lineHeight="1"
              color={wordmarkColor}
              display={{ base: "none", sm: "block" }}
            >
              event
              <Box as="span" color="brand.600">light</Box>
            </Text>
          </HStack>
        </Link>

        {/* Search — desktop */}
        <Box flex={1} maxW="440px" display={{ base: "none", md: "block" }}>
          <form onSubmit={handleSearchSubmit}>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none" pl={1}>
                <Icon as={FiSearch} color="gray.400" boxSize={4} />
              </InputLeftElement>
              <Input
                ref={searchRef}
                variant="filled"
                borderRadius="full"
                placeholder="Search events, places..."
                fontSize="sm"
                bg={inputBg}
                border="1.5px solid transparent"
                _hover={{ bg: inputHoverBg }}
                _focus={{
                  bg: isDark ? "gray.800" : "white",
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 3px rgba(139,92,246,0.15)",
                }}
                h="36px"
              />
            </InputGroup>
          </form>
        </Box>

        {/* Right Actions — desktop */}
        <HStack spacing={1.5} ml="auto" display={{ base: "none", md: "flex" }}>
          {/* Theme toggle */}
          <IconButton
            aria-label="Toggle theme"
            icon={isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
            variant="ghost"
            borderRadius="full"
            size="sm"
            onClick={toggleColorMode}
            color={mutedColor}
            _hover={{ bg: isDark ? "gray.800" : "gray.100", color: isDark ? "white" : "gray.900" }}
          />

          {isAuthenticated ? (
            <>
              <Link to="/events/add-event">
                <Button
                  variant="brand"
                  size="sm"
                  leftIcon={<FiPlus size={14} />}
                  borderRadius="full"
                  px={4}
                >
                  Create Event
                </Button>
              </Link>

              {/* Notifications */}
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Notifications"
                  icon={
                    <Box position="relative" display="inline-flex">
                      <FiBell size={16} />
                      <Box
                        position="absolute"
                        top="-4px"
                        right="-4px"
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg="brand.500"
                        border="1.5px solid"
                        borderColor={isDark ? "gray.900" : "white"}
                      />
                    </Box>
                  }
                  variant="ghost"
                  borderRadius="full"
                  size="sm"
                  color={mutedColor}
                  _hover={{ bg: isDark ? "gray.800" : "gray.100" }}
                />
                <MenuList
                  bg={menuBg}
                  borderColor={menuBorder}
                  boxShadow="0 20px 60px rgba(0,0,0,0.15)"
                  borderRadius="2xl"
                  p={2}
                  minW="300px"
                >
                  <Text
                    px={3}
                    py={1}
                    fontWeight="700"
                    fontSize="sm"
                    color={mutedColor}
                    mb={1}
                  >
                    Notifications
                  </Text>
                  {[
                    { title: "Event Reminder", body: "Your event starts in 2 hours!" },
                    { title: "New Event Near You", body: "A new event was added to your area." },
                    { title: "Update Available", body: "Check out new features in EventLight." },
                  ].map(({ title, body }) => (
                    <MenuItem
                      key={title}
                      borderRadius="xl"
                      py={3}
                      _hover={{ bg: menuHoverBg }}
                    >
                      <Box>
                        <Text fontWeight="600" fontSize="sm">{title}</Text>
                        <Text fontSize="xs" color={mutedColor}>{body}</Text>
                      </Box>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              {/* Account */}
              <Menu>
                <MenuButton>
                  <Avatar
                    size="sm"
                    name={user?.email || "User"}
                    bg="brand.600"
                    color="white"
                    cursor="pointer"
                    boxSize="34px"
                    fontSize="xs"
                    fontWeight="700"
                    _hover={{ ring: "2px", ringColor: "brand.400", ringOffset: "2px" }}
                  />
                </MenuButton>
                <MenuList
                  bg={menuBg}
                  borderColor={menuBorder}
                  boxShadow="0 20px 60px rgba(0,0,0,0.15)"
                  borderRadius="2xl"
                  p={2}
                  minW="210px"
                >
                  <Box px={3} py={2} mb={1}>
                    <Text fontWeight="700" fontSize="sm" noOfLines={1}>{user?.email}</Text>
                    <Text fontSize="xs" color={mutedColor}>Member</Text>
                  </Box>
                  <MenuDivider borderColor={menuBorder} />
                  <MenuItem borderRadius="xl" icon={<IoPersonOutline />} onClick={() => navigate("/dashboard/account")} _hover={{ bg: menuHoverBg }}>My Account</MenuItem>
                  <MenuItem borderRadius="xl" icon={<FiHeart size={14} />} onClick={() => navigate("/dashboard/liked-events")} _hover={{ bg: menuHoverBg }}>Liked Events</MenuItem>
                  <MenuItem borderRadius="xl" icon={<FiBookmark size={14} />} onClick={() => navigate("/dashboard/saved-events")} _hover={{ bg: menuHoverBg }}>Saved Events</MenuItem>
                  <MenuItem borderRadius="xl" icon={<FiClipboard size={14} />} onClick={() => navigate("/dashboard/my-events")} _hover={{ bg: menuHoverBg }}>My Events</MenuItem>
                  <MenuDivider borderColor={menuBorder} />
                  <MenuItem borderRadius="xl" icon={<FiSettings size={14} />} onClick={() => navigate("/dashboard/settings")} _hover={{ bg: menuHoverBg }}>Settings</MenuItem>
                  <MenuItem
                    borderRadius="xl"
                    icon={<FiLogOut size={14} />}
                    onClick={handleLogout}
                    color="red.400"
                    _hover={{ bg: "red.50", color: "red.500" }}
                  >
                    Log Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                borderRadius="full"
                onClick={() => navigate("/auth/login")}
                color={transparent ? "rgba(255,255,255,0.8)" : mutedColor}
                _hover={{
                  bg: transparent ? "rgba(255,255,255,0.12)" : isDark ? "gray.800" : "gray.100",
                  color: "white",
                }}
                leftIcon={<FiLogIn size={14} />}
              >
                Log in
              </Button>
              <Button
                variant="brand"
                size="sm"
                borderRadius="full"
                px={5}
                onClick={() => navigate("/auth/register")}
              >
                Sign up free
              </Button>
            </>
          )}
        </HStack>

        {/* Mobile right */}
        <HStack spacing={1} ml="auto" display={{ base: "flex", md: "none" }}>
          <IconButton
            aria-label="Search"
            icon={<FiSearch size={18} />}
            variant="ghost"
            borderRadius="full"
            size="sm"
            color={mutedColor}
          />
          <IconButton
            aria-label="Open menu"
            icon={<FiMenu size={18} />}
            variant="ghost"
            borderRadius="full"
            onClick={onOpen}
            color={mutedColor}
          />
        </HStack>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay backdropFilter="blur(6px)" bg="blackAlpha.300" />
        <DrawerContent
          bg={isDark ? "gray.900" : "white"}
          borderLeft="1px solid"
          borderColor={borderColor}
        >
          <DrawerCloseButton mt={3} color={mutedColor} />
          <DrawerHeader
            borderBottomWidth="1px"
            borderColor={borderColor}
            pb={4}
            pt={5}
          >
            <HStack spacing={2} align="center">
              <Image src={logo} h="24px" w="24px" alt="EventLight icon" />
              <Text fontWeight="800" fontSize="lg" letterSpacing="-0.04em" color={wordmarkColor}>
                event<Box as="span" color="brand.600">light</Box>
              </Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody py={5} px={4}>
            <VStack spacing={1} align="stretch">
              {/* Mobile search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchRef.current) {
                    onSearch(searchRef.current.value);
                    onClose();
                  }
                }}
              >
                <InputGroup mb={4} size="sm">
                  <InputLeftElement pl={1}>
                    <Icon as={FiSearch} color="gray.400" boxSize={4} />
                  </InputLeftElement>
                  <Input
                    ref={searchRef}
                    borderRadius="full"
                    placeholder="Search events..."
                    variant="filled"
                    bg={inputBg}
                  />
                </InputGroup>
              </form>

              {isAuthenticated ? (
                <>
                  <Box
                    px={3}
                    py={3}
                    borderRadius="xl"
                    bg={isDark ? "gray.800" : "gray.50"}
                    mb={2}
                  >
                    <Text fontWeight="700" fontSize="sm" noOfLines={1}>
                      {user?.email}
                    </Text>
                    <Text fontSize="xs" color={mutedColor}>
                      Member
                    </Text>
                  </Box>

                  {[
                    { icon: FiPlus, label: "Create Event", path: "/events/add-event" },
                    { icon: IoPersonOutline, label: "My Account", path: "/dashboard/account" },
                    { icon: FiBell, label: "Notifications", path: "/dashboard/notifications" },
                    { icon: FiHeart, label: "Liked Events", path: "/dashboard/liked-events" },
                    { icon: FiBookmark, label: "Saved Events", path: "/dashboard/saved-events" },
                    { icon: FiClipboard, label: "My Events", path: "/dashboard/my-events" },
                    { icon: FiSettings, label: "Settings", path: "/dashboard/settings" },
                  ].map(({ icon, label, path }) => (
                    <Box
                      key={label}
                      as="button"
                      onClick={() => { navigate(path); onClose(); }}
                      display="flex"
                      alignItems="center"
                      gap={3}
                      px={3}
                      py={2.5}
                      borderRadius="xl"
                      w="100%"
                      textAlign="left"
                      color={isDark ? "gray.200" : "gray.700"}
                      fontWeight="500"
                      fontSize="sm"
                      _hover={{ bg: isDark ? "gray.800" : "gray.50", color: "brand.600" }}
                      transition="all 0.15s ease"
                    >
                      <Icon as={icon} boxSize={4} />
                      {label}
                    </Box>
                  ))}

                  <Divider my={2} borderColor={borderColor} />

                  <Box
                    as="button"
                    onClick={handleLogout}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    px={3}
                    py={2.5}
                    borderRadius="xl"
                    w="100%"
                    textAlign="left"
                    color="red.400"
                    fontWeight="500"
                    fontSize="sm"
                    _hover={{ bg: "red.50", color: "red.500" }}
                    transition="all 0.15s ease"
                  >
                    <Icon as={FiLogOut} boxSize={4} />
                    Log Out
                  </Box>
                </>
              ) : (
                <VStack spacing={2}>
                  <Button
                    variant="brand"
                    w="full"
                    borderRadius="xl"
                    onClick={() => { navigate("/auth/register"); onClose(); }}
                  >
                    Sign up free
                  </Button>
                  <Button
                    variant="ghost"
                    w="full"
                    borderRadius="xl"
                    leftIcon={<FiLogIn />}
                    onClick={() => { navigate("/auth/login"); onClose(); }}
                    color={mutedColor}
                  >
                    Log in
                  </Button>
                </VStack>
              )}

              <Divider my={3} borderColor={borderColor} />

              <Flex
                align="center"
                justify="space-between"
                px={3}
                py={2}
              >
                <Text fontSize="sm" fontWeight="500" color={mutedColor}>
                  {isDark ? "Dark mode" : "Light mode"}
                </Text>
                <IconButton
                  aria-label="Toggle theme"
                  icon={isDark ? <FiSun size={15} /> : <FiMoon size={15} />}
                  size="sm"
                  variant="ghost"
                  borderRadius="full"
                  onClick={toggleColorMode}
                  color={mutedColor}
                />
              </Flex>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default NavBar;
