import {
  Box,
  Text,
  HStack,
  Avatar,
  VStack,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FiBell,
  FiBookmark,
  FiClipboard,
  FiHeart,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import Account from "./Account";
import SavedEvents from "./SavedEvents";
import LikedEvents from "./LikedEvents";
import MyEvents from "./MyEvents";



const Settings = () => <Text>Settings Component Placeholder</Text>;
const Logout = () => <Text>Logout Component Placeholder</Text>;
const Notifications = () => <Text>Notifications Component Placeholder</Text>;

const UserDashboard = () => {
  const [selectedOption, setSelectedOption] = useState<string>("account"); // Default selected option
  const { colorMode } = useColorMode(); // Hook to get the current color mode

  const renderContent = () => {
    switch (selectedOption) {
      case "account":
        return <Account />;
      case "saved-events":
        return <SavedEvents />;
      case "liked-events":
        return <LikedEvents />;
      case "my-events":
        return <MyEvents />;
      case "settings":
        return <Settings />;
      case "logout":
        return <Logout />;
      case "notifications":
        return <Notifications />;
      default:
        return <Text>Select an option</Text>;
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* Top Header with Logo and Greeting */}
      <HStack p={4} fontWeight="bold" gap="100px" justify="space-between">
        <HStack>
          <Avatar name="Logo" size="sm" src="logo-url" />{" "}
          {/* Add your logo here */}
          <Text fontSize="lg">EventLight</Text>
        </HStack>
        <Text fontSize="xl">Hi, Chiamaka</Text>
        <Button bg="none" rightIcon={<FiLogOut />} _hover={{ transform: "scale(1.06)" }} color="red.500">
          <Text fontSize="lg">Log Out</Text>
        </Button>
      </HStack>

      <HStack
        h="100vh"
        justifySelf="center"
        justifyContent="space-around"
        align="flex-start"
        p="30px"
      >
        <VStack
          borderRadius=".5rem"
          align="left"
          fontSize="lg"
          gap="2rem"
          flex="0 0 30%"
          bg={colorMode === "dark" ? "gray.700" : "gray.50"} // Background color based on mode
          p={4}
          boxShadow="md"
          cursor="pointer"
          //   fontWeight="400"
        >
          <HStack>
            <IoPersonOutline />
            <Text onClick={() => setSelectedOption("account")}>My Account</Text>
          </HStack>
          <HStack>
            <FiBell />
            <Text onClick={() => setSelectedOption("notifications")}>
              Notifications
            </Text>
          </HStack>
          <HStack>
            <FiBookmark />
            <Text onClick={() => setSelectedOption("saved-events")}>
              Saved Events
            </Text>
          </HStack>
          <HStack>
            <FiHeart />
            <Text onClick={() => setSelectedOption("liked-events")}>
              Liked Events
            </Text>
          </HStack>
          <HStack>
            <FiClipboard />
            <Text onClick={() => setSelectedOption("my-events")}>
              My Events
            </Text>
          </HStack>
          <HStack>
            <FiSettings />
            <Text onClick={() => setSelectedOption("settings")}>Settings</Text>
          </HStack>
        </VStack>

        {/* Main Content Area (Right Side) */}
        <Box
          borderRadius=".5rem"
          bg={colorMode === "dark" ? "gray.700" : "gray.50"}
          //   height="50vh"
          flex="0 0 65%"
          p={4}
          boxShadow="md"
        >
          {renderContent()}
        </Box>
      </HStack>
    </Box>
  );
};

export default UserDashboard;
