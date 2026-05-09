import {
  Box,
  Text,
  HStack,
  VStack,
  Avatar,
  Icon,
  Flex,
  Image,
  useColorModeValue,
  useColorMode,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import {
  FiBell,
  FiBookmark,
  FiClipboard,
  FiHeart,
  FiLogOut,
  FiSettings,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.svg";

const NAV_ITEMS = [
  { to: "account", icon: IoPersonOutline, label: "My Account" },
  { to: "notifications", icon: FiBell, label: "Notifications" },
  { to: "saved-events", icon: FiBookmark, label: "Saved Events" },
  { to: "liked-events", icon: FiHeart, label: "Liked Events" },
  { to: "my-events", icon: FiClipboard, label: "My Events" },
  { to: "settings", icon: FiSettings, label: "Settings" },
];

const UserDashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const sidebarBg = useColorModeValue("white", "gray.900");
  const contentBg = useColorModeValue("gray.50", "gray.950");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const navActiveBg = useColorModeValue("brand.50", "gray.800");
  const navActiveColor = "brand.600";
  const navHoverBg = useColorModeValue("gray.50", "gray.800");
  const wordmarkColor = useColorModeValue("gray.900", "white");

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    navigate("/", { replace: true });
  };

  const displayName =
    user?.first_name
      ? `${user.first_name}${user.last_name ? " " + user.last_name : ""}`
      : user?.email?.split("@")[0] || "User";

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        w={{ base: "full", md: "260px" }}
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        bg={sidebarBg}
        borderRight="1px solid"
        borderColor={borderColor}
        flexShrink={0}
        position="sticky"
        top={0}
        h="100vh"
        overflowY="auto"
      >
        {/* Logo */}
        <Box px={6} py={5} borderBottom="1px solid" borderColor={borderColor}>
          <Link to="/">
            <HStack spacing={2.5} align="center">
              <Image src={logo} h="26px" w="26px" alt="eventlight icon" />
              <Text fontWeight="800" fontSize="lg" letterSpacing="-0.04em" color={wordmarkColor}>
                event<Box as="span" color="brand.600">light</Box>
              </Text>
            </HStack>
          </Link>
        </Box>

        {/* User profile mini-card */}
        <Box px={5} py={4} borderBottom="1px solid" borderColor={borderColor}>
          <HStack spacing={3}>
            <Avatar
              name={displayName}
              size="sm"
              bg="brand.600"
              color="white"
              fontSize="xs"
              fontWeight="700"
            />
            <Box minW={0}>
              <Text fontWeight="700" fontSize="sm" noOfLines={1}>{displayName}</Text>
              <Text fontSize="xs" color={mutedColor} noOfLines={1}>{user?.email}</Text>
            </Box>
          </HStack>
        </Box>

        {/* Nav items */}
        <VStack align="stretch" spacing={0.5} px={3} py={4} flex={1}>
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === "account"}>
              {({ isActive }) => (
                <HStack
                  spacing={3}
                  px={3}
                  py={2.5}
                  borderRadius="xl"
                  bg={isActive ? navActiveBg : "transparent"}
                  color={isActive ? navActiveColor : mutedColor}
                  fontWeight={isActive ? "600" : "500"}
                  fontSize="sm"
                  _hover={{ bg: isActive ? navActiveBg : navHoverBg, color: isActive ? navActiveColor : wordmarkColor }}
                  transition="all 0.15s ease"
                  cursor="pointer"
                >
                  <Icon as={icon} boxSize={4} flexShrink={0} />
                  <Text>{label}</Text>
                </HStack>
              )}
            </NavLink>
          ))}
        </VStack>

        {/* Sidebar footer */}
        <Box px={3} py={4} borderTop="1px solid" borderColor={borderColor}>
          <HStack spacing={3} px={3} py={2.5} borderRadius="xl" cursor="pointer"
            color="red.400" fontWeight="500" fontSize="sm"
            _hover={{ bg: "red.50", color: "red.500" }}
            transition="all 0.15s ease"
            onClick={handleLogout}
          >
            <Icon as={FiLogOut} boxSize={4} flexShrink={0} />
            <Text>Log out</Text>
          </HStack>

          <Divider my={2} borderColor={borderColor} />

          <HStack px={3} py={1} justify="space-between">
            <Text fontSize="xs" color={mutedColor}>{isDark ? "Dark mode" : "Light mode"}</Text>
            <IconButton
              aria-label="Toggle theme"
              icon={isDark ? <FiSun size={13} /> : <FiMoon size={13} />}
              size="xs"
              variant="ghost"
              borderRadius="full"
              color={mutedColor}
              onClick={toggleColorMode}
            />
          </HStack>
        </Box>
      </Box>

      {/* Main content */}
      <Box flex={1} bg={contentBg} minH="100vh" overflowY="auto">
        {/* Mobile top bar */}
        <Box
          display={{ base: "flex", md: "none" }}
          px={4}
          py={3}
          bg={sidebarBg}
          borderBottom="1px solid"
          borderColor={borderColor}
          alignItems="center"
          justifyContent="space-between"
          position="sticky"
          top={0}
          zIndex={50}
        >
          <Link to="/">
            <HStack spacing={2}>
              <Image src={logo} h="24px" w="24px" alt="eventlight icon" />
              <Text fontWeight="800" fontSize="md" letterSpacing="-0.04em" color={wordmarkColor}>
                event<Box as="span" color="brand.600">light</Box>
              </Text>
            </HStack>
          </Link>
          <HStack spacing={2}>
            <Text fontSize="sm" color={mutedColor}>
              Hi, {user?.first_name || user?.email?.split("@")[0] || "User"}
            </Text>
            <Avatar name={displayName} size="xs" bg="brand.600" color="white" fontSize="xs" fontWeight="700" />
          </HStack>
        </Box>

        {/* Page content */}
        <Box maxW="900px" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default UserDashboard;
