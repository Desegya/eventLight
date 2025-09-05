import {
  Box,
  Text,
  HStack,
  Avatar,
  VStack,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import {
  FiBell,
  FiBookmark,
  FiClipboard,
  FiHeart,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const UserDashboard = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true }); // Redirect to home page
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to home
      navigate("/", { replace: true });
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* Top Header with Logo and Greeting */}
      <HStack p={4} fontWeight="bold" gap="100px" justify="space-between">
        <HStack
          cursor="pointer"
          onClick={() => navigate("/")}
          _hover={{ transform: "scale(1.02)" }}
          transition="transform 0.2s"
        >
          <Avatar name="Logo" size="sm" src="logo-url" /> {/* Add your logo */}
          <Text fontSize="lg">EventLight</Text>
        </HStack>
        <Text fontSize="xl">
          Hi, {user?.first_name || user?.email?.split("@")[0] || "User"}
        </Text>
        <Button
          bg="none"
          rightIcon={<FiLogOut />}
          _hover={{ transform: "scale(1.06)" }}
          color="red.500"
          onClick={handleLogout}
        >
          <Text fontSize="lg">Log Out</Text>
        </Button>
      </HStack>

      <HStack
        h="100vh"
        align="flex-start"
        justifyContent="space-around"
        p="30px"
      >
        {/* Sidebar Navigation */}
        <VStack
          borderRadius=".5rem"
          align="left"
          fontSize="lg"
          gap="2rem"
          flex="0 0 30%"
          bg={colorMode === "dark" ? "gray.700" : "gray.50"}
          p={4}
          boxShadow="md"
        >
          <HStack>
            <IoPersonOutline />
            <NavLink to="account">
              <Text>My Account</Text>
            </NavLink>
          </HStack>
          <HStack>
            <FiBell />
            <NavLink to="notifications">
              <Text>Notifications</Text>
            </NavLink>
          </HStack>
          <HStack>
            <FiBookmark />
            <NavLink to="saved-events">
              <Text>Saved Events</Text>
            </NavLink>
          </HStack>
          <HStack>
            <FiHeart />
            <NavLink to="liked-events">
              <Text>Liked Events</Text>
            </NavLink>
          </HStack>
          <HStack>
            <FiClipboard />
            <NavLink to="my-events">
              <Text>My Events</Text>
            </NavLink>
          </HStack>
          <HStack>
            <FiSettings />
            <NavLink to="settings">
              <Text>Settings</Text>
            </NavLink>
          </HStack>
        </VStack>

        {/* Main Content Area */}
        <Box
          borderRadius=".5rem"
          bg={colorMode === "dark" ? "gray.700" : "gray.50"}
          flex="0 0 65%"
          p={4}
          boxShadow="md"
        >
          <Outlet /> {/* Render the child routes here */}
        </Box>
      </HStack>
    </Box>
  );
};

export default UserDashboard;
