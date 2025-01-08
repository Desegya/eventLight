import {
  HStack,
  Image,
  Button,
  Box,
  Flex,
  IconButton,
  VStack,
  useColorMode,
  Icon,
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
} from "@chakra-ui/react";
import {
  FiPlus,
  FiSearch,
  FiLogIn,
  FiHeart,
  FiBookmark,
  FiSettings,
  FiLogOut,
  FiBell,
  FiClipboard
} from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseSharp, IoPersonOutline } from "react-icons/io5";
import logo from "../assets/logo.svg";
import SearchInput from "./SearchInput";
import ColorModeSwitch from "./ColorModeSwitch";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  onSearch: (searchText: string) => void;
  isAuthenticated: boolean; // Adding isAuthenticated prop to conditionally render content
  onLogout: () => void; // A function to handle logging out
  onLogin: () => void; // A function to handle logging in
}

const NavBar = ({ onSearch, isAuthenticated, onLogout, onLogin }: Props) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  return (
    <Box
      bg={isDark ? "gray.800" : "white"}
      color={isDark ? "white" : "blue.800"}
      px={4}
      py={2}
    >
      <Flex align="center" justify="space-between" wrap="wrap">
        <Image src={logo} boxSize="80px" alt="EventLight Logo" />

        <Box flex="1" mx={4}>
          <SearchInput onSearch={onSearch} />
        </Box>

        {/* Hamburger menu for tablet and mobile */}
        <IconButton
          display={{
            base: "block",
            md: isAuthenticated ? "block" : "none",
            lg: "none",
          }}
          icon={isOpen ? <IoCloseSharp /> : <RxHamburgerMenu />}
          aria-label="Toggle Menu"
          variant="ghost"
          onClick={isOpen ? onClose : onOpen}
        />

        <HStack spacing={4} display={{ base: "none", md: "flex", lg: "flex" }}>
          {isAuthenticated && (
            <>
              <Link to={`/events/add-event`}>
                <Button
                  display={{ base: "none", lg: "inline-flex" }}
                  bg={isDark ? "blue.600" : "blue.800"}
                  color="white"
                  leftIcon={<Icon as={FiPlus} />}
                  borderRadius="full"
                  _hover={{ bg: isDark ? "blue.500" : "blue.600" }}
                >
                  Add Events
                </Button>
              </Link>
              
              <Menu>
                <MenuButton
                  display={{ base: "none", lg: "inline-flex" }}
                  as={IconButton}
                  border="1px solid"
                  borderRadius="full"
                  aria-label="Notifications"
                  icon={<FiBell />}
                  variant="ghost"
                  color={isDark ? "blue.300" : "blue.800"}
                  _hover={{
                    bg: isDark ? "blue.600" : "blue.100",
                    color: isDark ? "blue.500" : "blue.600",
                  }}
                />
                <MenuList>
                  <MenuItem>
                    <Box>
                      <strong>Event Reminder</strong>
                      <p>Your event is starting soon!</p>
                    </Box>
                  </MenuItem>
                  <MenuItem>
                    <Box>
                      <strong>New Event Added</strong>
                      <p>A new event has been added to your favorite list.</p>
                    </Box>
                  </MenuItem>
                  <MenuItem>
                    <Box>
                      <strong>Update Available</strong>
                      <p>Your app has a new update available.</p>
                    </Box>
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          )}

          {!isAuthenticated ? (
            <Button
              variant="ghost"
              color={isDark ? "blue.300" : "blue.800"}
              _hover={{
                bg: isDark ? "blue.700" : "blue.50",
                color: isDark ? "blue.500" : "blue.600",
              }}
              onClick={onLogin}
              leftIcon={<Icon as={FiLogIn} />}
            >
              Sign Up / Login
            </Button>
          ) : (
            <>
              <Menu>
                <MenuButton
                  display={{ base: "none", lg: "flex" }}
                  aria-label="Account"
                  alignItems="center"
                  justifyContent="center"
                  w="40px"
                  h="40px"
                  border="1px solid"
                  borderColor={isDark ? "blue.500" : "blue.800"}
                  borderRadius="full"
                  color={isDark ? "blue.300" : "blue.800"}
                  _hover={{
                    bg: isDark ? "blue.600" : "blue.100",
                    color: isDark ? "blue.500" : "blue.600",
                  }}
                >
                  <Icon as={IoPersonOutline} />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => navigate("/account")}
                    icon={<Icon as={IoPersonOutline} />}
                  >
                    My Account
                  </MenuItem>
                  <MenuItem onClick={() => {}} icon={<Icon as={FiHeart} />}>
                    Liked Events
                  </MenuItem>
                  <MenuItem onClick={() => {}} icon={<Icon as={FiBookmark} />}>
                    Saved Events
                  </MenuItem>
                  <MenuItem onClick={() => {}} icon={<Icon as={FiClipboard} />}>
                    My Events
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => {}} icon={<Icon as={FiSettings} />}>
                    Settings
                  </MenuItem>
                  <MenuItem
                    onClick={onLogout}
                    icon={<Icon as={FiLogOut} />}
                    color="red"
                  >
                    Log Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          )}

          {/* Color Mode Switch only for non-authenticated users */}
          {!isAuthenticated && <ColorModeSwitch />}
        </HStack>
      </Flex>

      {/* Drawer for mobile menu */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent bg={isDark ? "gray.800" : "white"}>
            <DrawerCloseButton color={isDark ? "white" : "blue.800"} />
            <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>

            <DrawerBody>
              <VStack as="nav" spacing={4} align="flex-start">
                {/* Mobile Text Links */}
                {!isAuthenticated ? (
                  <>
                    <Box
                      as="a"
                      href="#"
                      color={isDark ? "blue.300" : "blue.800"}
                      fontWeight="bold"
                      _hover={{
                        color: isDark ? "blue.500" : "blue.600",
                      }}
                      display="flex"
                      alignItems="center"
                      onClick={onLogin}
                    >
                      <Icon as={FiLogIn} mr={2} />
                      Sign Up / Login
                    </Box>
                    <ColorModeSwitch />
                  </>
                ) : (
                  <>
                    <Box
                      as="a"
                      href="#"
                      color={isDark ? "blue.300" : "blue.800"}
                      fontWeight="bold"
                      _hover={{
                        color: isDark ? "blue.500" : "blue.600",
                      }}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={FiPlus} mr={2} />
                      Add Events
                    </Box>
                    <Box
                      as="a"
                      href="#"
                      color={isDark ? "blue.300" : "blue.800"}
                      fontWeight="bold"
                      _hover={{
                        color: isDark ? "blue.500" : "blue.600",
                      }}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={FiSearch} mr={2} />
                      Find Events
                    </Box>
                    <Box
                      as="a"
                      href="#"
                      color={isDark ? "blue.300" : "blue.800"}
                      fontWeight="bold"
                      _hover={{
                        color: isDark ? "blue.500" : "blue.600",
                      }}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={FiHeart} mr={2} />
                      Liked Events
                    </Box>
                    <Box
                      as="a"
                      href="#"
                      color={isDark ? "blue.300" : "blue.800"}
                      fontWeight="bold"
                      _hover={{
                        color: isDark ? "blue.500" : "blue.600",
                      }}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={FiBookmark} mr={2} />
                      Saved Events
                    </Box>
                    <Box
                      as="a"
                      href="#"
                      color={isDark ? "blue.300" : "blue.800"}
                      fontWeight="bold"
                      _hover={{
                        color: isDark ? "blue.500" : "blue.600",
                      }}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={FiBell} mr={2} />
                      Notifications
                    </Box>
                    <Box
                      as="a"
                      href="#"
                      color={isDark ? "blue.300" : "blue.800"}
                      fontWeight="bold"
                      _hover={{
                        color: isDark ? "blue.500" : "blue.600",
                      }}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={FiSettings} mr={2} />
                      Settings
                    </Box>
                    <Box
                      as="a"
                      href="#"
                      color="red"
                      fontWeight="bold"
                      _hover={{
                        color: "red.500",
                      }}
                      display="flex"
                      alignItems="center"
                      onClick={onLogout}
                    >
                      <Icon as={FiLogOut} mr={2} />
                      Log Out
                    </Box>
                  </>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default NavBar;
