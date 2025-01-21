import {
  Box,
  Text,
  HStack,
  Avatar,
  VStack,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import { FiBell, FiBookmark, FiClipboard, FiHeart, FiLogOut, FiSettings } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout functionality
    console.log("Logged out");
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* Top Header with Logo and Greeting */}
      <HStack p={4} fontWeight="bold" gap="100px" justify="space-between">
        <HStack>
          <Avatar name="Logo" size="sm" src="logo-url" /> {/* Add your logo */}
          <Text fontSize="lg">EventLight</Text>
        </HStack>
        <Text fontSize="xl">Hi, Chiamaka</Text>
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

      <HStack h="100vh" align="flex-start" justifyContent="space-around" p="30px">
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
