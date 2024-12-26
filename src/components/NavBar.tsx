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
import { IoCloseSharp } from "react-icons/io5";
import logo from "../assets/logo.svg";
import SearchInput from "./SearchInput";
import ColorModeSwitch from "./ColorModeSwitch";

interface Props {
  onSearch: (searchText: string) => void;
}

const NavBar = ({ onSearch }: Props) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={isDark ? "gray.800" : "white"} color={isDark ? "white" : "blue.800"} px={4} py={2}>
      <Flex align="center" justify="space-between" wrap="wrap">
        <Image src={logo} boxSize="80px" alt="EventLight Logo" />

        <Box flex="1" mx={4}>
          <SearchInput onSearch={onSearch} />
        </Box>

        {/* Hamburger Menu (Mobile) */}
        <IconButton
          display={{ base: "block", lg: "none" }}
          icon={isOpen ? <IoCloseSharp /> : <RxHamburgerMenu />}
          aria-label="Toggle Menu"
          variant="ghost"
          onClick={isOpen ? onClose : onOpen}
        />

        <HStack
          spacing={4}
          display={{ base: "none", lg: "flex" }}
        >
          <Button
            bg={isDark ? "blue.600" : "blue.800"}
            color="white"
            leftIcon={<Icon as={FiPlus} />}
            _hover={{ bg: isDark ? "blue.500" : "blue.600" }}
          >
            Add Events
          </Button>
          <Button
            variant="outline"
            color={isDark ? "blue.300" : "blue.800"}
            borderColor={isDark ? "blue.300" : "blue.800"}
            leftIcon={<Icon as={FiSearch} />}
            _hover={{ bg: isDark ? "blue.700" : "blue.50" }}
          >
            Find Events
          </Button>
          <Button
            variant="ghost"
            color={isDark ? "blue.300" : "blue.800"}
            _hover={{ bg: isDark ? "blue.700" : "blue.50", color: isDark ? "blue.500" : "blue.600" }}
          >
            Sign Up / Login
          </Button>
          <ColorModeSwitch />
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
                <Button
                  bg={isDark ? "blue.600" : "blue.800"}
                  color="white"
                  leftIcon={<Icon as={FiPlus} />}
                  _hover={{ bg: isDark ? "blue.500" : "blue.600" }}
                  onClick={onClose}
                >
                  Add Events
                </Button>
                <Button
                  variant="outline"
                  color={isDark ? "blue.300" : "blue.800"}
                  borderColor={isDark ? "blue.300" : "blue.800"}
                  leftIcon={<Icon as={FiSearch} />}
                  _hover={{ bg: isDark ? "blue.700" : "blue.50" }}
                  onClick={onClose}
                >
                  Find Events
                </Button>
                <Button
                  variant="ghost"
                  color={isDark ? "blue.300" : "blue.800"}
                  _hover={{ bg: isDark ? "blue.700" : "blue.50", color: isDark ? "blue.500" : "blue.600" }}
                  onClick={onClose}
                >
                  Sign Up / Login
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default NavBar;
