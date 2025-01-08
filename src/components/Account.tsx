import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Button,
  Input,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from "@chakra-ui/react";
import { BiEdit, BiUser, BiPhone, BiCamera } from "react-icons/bi";

import { FiMail } from "react-icons/fi";

type UserInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  profilePicture: string;
};

const Account = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Cityville",
    profilePicture: "",
  });

  const [editField, setEditField] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleEdit = (field: string) => {
    setEditField(field);
  };

  const handleSave = () => {
    setEditField("");
  };

  const handleTakePhoto = () => {
    alert("Take Photo clicked.");
  };

  const handleChoosePhoto = () => {
    alert("Choose Photo clicked.");
  };

  const handleDeletePhoto = () => {
    setUserInfo({ ...userInfo, profilePicture: "" });
    alert("Profile picture deleted.");
  };

  return (
    <Box>
      <Flex justify="center" align="center">
        <Box borderRadius="lg" w="100%" maxW="800px">
          <Heading
            as="h2"
            textAlign="center"
            size="md"
            mb={{ base: 4, md: "2rem" }}
          >
            My Account
          </Heading>

          <Flex flexDirection={{ base: "column", md: "row" }}>
            {/* Left Section: Profile Picture */}
            <Box
              flex="1"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              mb={{ base: 4, md: 0 }}
            >
              <Image
                boxSize="200px"
                // borderRadius="full"
                src={userInfo.profilePicture || "https://picsum.photos/200/300"}
                alt={userInfo.name}
                mb={4}
                objectFit="cover"
              />
              <Menu>
                <MenuButton as={Button} color="white" bg="blue.800" size="sm">
                  Edit
                </MenuButton>
                <MenuList>
                  <MenuItem
                    icon={<Icon as={BiCamera} />}
                    onClick={handleTakePhoto}
                  >
                    Take Photo
                  </MenuItem>
                  <MenuItem
                    icon={<Icon as={BiEdit} />}
                    onClick={handleChoosePhoto}
                  >
                    Choose Photo
                  </MenuItem>
                  <MenuItem
                    icon={<Icon as={BiCamera} />}
                    onClick={handleDeletePhoto}
                  >
                    Delete Photo
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>

            {/* Right Section: Personal Information */}
            <Box
              flex="2"
              pl={{ base: 0, md: 6 }}
              textAlign={{ base: "center", md: "left" }}
            >
              <VStack align="start" spacing={4}>
                {[
                  {
                    label: "Name",
                    value: userInfo.name,
                    icon: BiUser,
                    field: "name",
                  },
                  {
                    label: "Email",
                    value: userInfo.email,
                    icon: FiMail,
                    field: "email",
                  },
                  {
                    label: "Phone",
                    value: userInfo.phone,
                    icon: BiPhone,
                    field: "phone",
                  },
                  {
                    label: "Address",
                    value: userInfo.address,
                    icon: BiUser,
                    field: "address",
                  },
                ].map(({ label, value, icon, field }) => (
                  <HStack
                    key={field}
                    w="100%"
                    justify="space-between"
                    alignItems="center"
                    spacing={4}
                  >
                    <Box as={icon} fontSize="xl" />
                    {editField === field ? (
                      <FormControl>
                        <FormLabel srOnly>{label}</FormLabel>
                        <Input
                          name={field}
                          value={userInfo[field as keyof UserInfo]}
                          onChange={handleChange}
                          onBlur={handleSave}
                        />
                      </FormControl>
                    ) : (
                      <>
                        <Text flex="1" wordBreak="break-word">
                          {value}
                        </Text>
                        <Button
                          leftIcon={<BiEdit />}
                          size="sm"
                          onClick={() => handleEdit(field)}
                          bg="none"
                        ></Button>
                      </>
                    )}
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Account;
