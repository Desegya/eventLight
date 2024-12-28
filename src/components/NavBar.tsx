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
} from "@chakra-ui/react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiLogIn } from "react-icons/fi";
import { IoCloseSharp, IoPersonOutline } from "react-icons/io5";
import logo from "../assets/logo.svg";
import SearchInput from "./SearchInput";
import ColorModeSwitch from "./ColorModeSwitch";

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

  // Common Buttons (Add Events and Find Events)
  const commonButtons = (
    <>
      <Button
        bg={isDark ? "blue.600" : "blue.800"}
        color="white"
        leftIcon={<Icon as={FiPlus} />}
        borderRadius="full"
        _hover={{ bg: isDark ? "blue.500" : "blue.600" }}
      >
        Add Events
      </Button>
      <Button
        variant="outline"
        color={isDark ? "blue.300" : "blue.800"}
        borderColor={isDark ? "blue.300" : "blue.800"}
        borderRadius="full"
        leftIcon={<Icon as={FiSearch} />}
        _hover={{ bg: isDark ? "blue.700" : "blue.50" }}
      >
        Find Events
      </Button>
    </>
  );

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

        <IconButton
          display={{ base: "block", lg: "none" }}
          icon={isOpen ? <IoCloseSharp /> : <RxHamburgerMenu />}
          aria-label="Toggle Menu"
          variant="ghost"
          onClick={isOpen ? onClose : onOpen}
        />

        <HStack spacing={4} display={{ base: "none", lg: "flex" }}>
          {commonButtons}

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
              <Box
                as="button"
                aria-label="Account"
                display="flex"
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
                onClick={onLogout}
              >
                <Icon as={IoPersonOutline} />
              </Box>
            </>
          )}

          {/* Color Mode Switch only for non-authenticated users */}
          {!isAuthenticated && <ColorModeSwitch />}
        </HStack>
      </Flex>

      {/* Mobile Menu - Using Drawer as overlay */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent bg={isDark ? "gray.800" : "white"}>
            <DrawerCloseButton color={isDark ? "white" : "blue.800"} />
            <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>

            <DrawerBody>
              <VStack as="nav" spacing={4} align="flex-start">
                {/* Mobile Text Links */}
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

                {!isAuthenticated ? (
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
                      onClick={onLogout}
                    >
                      <Icon as={IoPersonOutline} mr={2} />
                      My Profile
                    </Box>
                  </>
                )}

                {/* Color Mode Switch only for non-authenticated users */}
                {!isAuthenticated && <ColorModeSwitch />}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default NavBar;
