import { useState, useEffect } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { BiEdit, BiUser, BiPhone, BiCamera } from "react-icons/bi";
import { FiMail } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { ProfileUpdateData } from "../types/auth";

const Account = () => {
  const { user, updateProfile, loading } = useAuth();
  const toast = useToast();
  const [editField, setEditField] = useState("");
  const [formData, setFormData] = useState<ProfileUpdateData>({});

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        street_address: user.street_address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "Nigeria",
        preferred_categories: user.preferred_categories || [],
        preferred_languages: user.preferred_languages || [],
        preferred_age_groups: user.preferred_age_groups || [],
        max_distance_km: user.max_distance_km,
        email_notifications: user.email_notifications ?? true,
        event_reminders: user.event_reminders ?? true,
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileUpdateData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (field: string) => {
    setEditField(field);
  };

  const handleSave = async (field: keyof ProfileUpdateData) => {
    try {
      const updateData = { [field]: formData[field] };
      await updateProfile(updateData);
      setEditField("");
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        street_address: user.street_address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "Nigeria",
        preferred_categories: user.preferred_categories || [],
        preferred_languages: user.preferred_languages || [],
        preferred_age_groups: user.preferred_age_groups || [],
        max_distance_km: user.max_distance_km,
        email_notifications: user.email_notifications ?? true,
        event_reminders: user.event_reminders ?? true,
      });
    }
    setEditField("");
  };

  const handleTakePhoto = () => {
    alert("Take Photo clicked.");
  };

  const handleChoosePhoto = () => {
    alert("Choose Photo clicked.");
  };

  const handleDeletePhoto = () => {
    alert("Profile picture deleted.");
  };

  if (!user) {
    return (
      <Box p={4} textAlign="center">
        <Text>Please log in to view your account.</Text>
      </Box>
    );
  }

  const displayName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User";

  return (
    <Box p={4}>
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
                src="https://picsum.photos/200/300"
                alt={displayName}
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
                    label: "First Name",
                    value: user.first_name || "Not provided",
                    icon: BiUser,
                    field: "first_name" as keyof ProfileUpdateData,
                  },
                  {
                    label: "Last Name",
                    value: user.last_name || "Not provided",
                    icon: BiUser,
                    field: "last_name" as keyof ProfileUpdateData,
                  },
                  {
                    label: "Email",
                    value: user.email,
                    icon: FiMail,
                    field: "email" as keyof ProfileUpdateData,
                    readonly: true,
                  },
                  {
                    label: "Phone",
                    value: user.phone_number || "Not provided",
                    icon: BiPhone,
                    field: "phone_number" as keyof ProfileUpdateData,
                  },
                  {
                    label: "Street Address",
                    value: user.street_address || "Not provided",
                    icon: BiUser,
                    field: "street_address" as keyof ProfileUpdateData,
                  },
                  {
                    label: "City",
                    value: user.city || "Not provided",
                    icon: BiUser,
                    field: "city" as keyof ProfileUpdateData,
                  },
                  {
                    label: "State",
                    value: user.state || "Not provided",
                    icon: BiUser,
                    field: "state" as keyof ProfileUpdateData,
                  },
                  {
                    label: "Country",
                    value: user.country || "Nigeria",
                    icon: BiUser,
                    field: "country" as keyof ProfileUpdateData,
                  },
                ].map(({ label, value, icon, field, readonly }) => (
                  <HStack
                    key={field}
                    w="100%"
                    justify="space-between"
                    alignItems="center"
                    spacing={4}
                  >
                    <Box as={icon} fontSize="xl" />
                    {editField === field ? (
                      <FormControl flex="1">
                        <FormLabel srOnly>{label}</FormLabel>
                        <HStack>
                          <Input
                            value={(formData[field] as string) || ""}
                            onChange={(e) =>
                              handleInputChange(field, e.target.value)
                            }
                            placeholder={label}
                          />
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleSave(field)}
                            isLoading={loading}
                          >
                            Save
                          </Button>
                          <Button size="sm" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </HStack>
                      </FormControl>
                    ) : (
                      <>
                        <VStack align="start" flex="1" spacing={0}>
                          <Text fontSize="sm" color="gray.500">
                            {label}
                          </Text>
                          <Text wordBreak="break-word">{value}</Text>
                        </VStack>
                        {!readonly && (
                          <Button
                            leftIcon={<BiEdit />}
                            size="sm"
                            onClick={() => handleEdit(field)}
                            bg="none"
                          >
                            Edit
                          </Button>
                        )}
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
