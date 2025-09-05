import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Switch,
  NumberInput,
  NumberInputField,
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  useToast,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ColorModeSwitch from "./ColorModeSwitch";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/auth";

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  // Password change modal state
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);

  // Preference arrays
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);

  // Available options
  const availableCategories = [
    "worship",
    "prayer",
    "fellowship",
    "bible_study",
    "outreach",
    "youth",
    "children",
    "music",
    "community_service",
  ];
  const availableLanguages = [
    "english",
    "yoruba",
    "igbo",
    "hausa",
    "french",
    "spanish",
  ];
  const availableAgeGroups = [
    "children",
    "youth",
    "young_adults",
    "adults",
    "seniors",
  ];

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setEmailNotifications(user.email_notifications ?? true);
      setEventReminders(user.event_reminders ?? true);
      setSelectedCategories(user.preferred_categories || []);
      setSelectedLanguages(user.preferred_languages || []);
      setSelectedAgeGroups(user.preferred_age_groups || []);
      setMaxDistance(user.max_distance_km);
    }
  }, [user]);

  const handlePasswordChange = async () => {
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    try {
      setPasswordLoading(true);
      await authService.changePassword({
        old_password: currentPassword,
        new_password1: newPassword,
        new_password2: confirmPassword,
      });

      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordModalOpen(false);
    } catch (error: any) {
      setPasswordError(error.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotificationUpdate = async (
    field: "email_notifications" | "event_reminders",
    value: boolean
  ) => {
    try {
      await updateProfile({ [field]: value });
      if (field === "email_notifications") {
        setEmailNotifications(value);
      } else {
        setEventReminders(value);
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update notification preferences.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePreferenceUpdate = async (field: string, value: any) => {
    try {
      await updateProfile({ [field]: value });
      toast({
        title: "Preferences Updated",
        description: "Your preferences have been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update preferences.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      const newCategories = [...selectedCategories, category];
      setSelectedCategories(newCategories);
      handlePreferenceUpdate("preferred_categories", newCategories);
    }
  };

  const removeCategory = (category: string) => {
    const newCategories = selectedCategories.filter((c) => c !== category);
    setSelectedCategories(newCategories);
    handlePreferenceUpdate("preferred_categories", newCategories);
  };

  const addLanguage = (language: string) => {
    if (!selectedLanguages.includes(language)) {
      const newLanguages = [...selectedLanguages, language];
      setSelectedLanguages(newLanguages);
      handlePreferenceUpdate("preferred_languages", newLanguages);
    }
  };

  const removeLanguage = (language: string) => {
    const newLanguages = selectedLanguages.filter((l) => l !== language);
    setSelectedLanguages(newLanguages);
    handlePreferenceUpdate("preferred_languages", newLanguages);
  };

  const addAgeGroup = (ageGroup: string) => {
    if (!selectedAgeGroups.includes(ageGroup)) {
      const newAgeGroups = [...selectedAgeGroups, ageGroup];
      setSelectedAgeGroups(newAgeGroups);
      handlePreferenceUpdate("preferred_age_groups", newAgeGroups);
    }
  };

  const removeAgeGroup = (ageGroup: string) => {
    const newAgeGroups = selectedAgeGroups.filter((a) => a !== ageGroup);
    setSelectedAgeGroups(newAgeGroups);
    handlePreferenceUpdate("preferred_age_groups", newAgeGroups);
  };

  const updateMaxDistance = (value: number | null) => {
    setMaxDistance(value);
    handlePreferenceUpdate("max_distance_km", value);
  };

  if (!user) {
    return (
      <Box p={4} textAlign="center">
        <Text>Please log in to access settings.</Text>
      </Box>
    );
  }

  return (
    <Box p={4} maxW="800px" mx="auto">
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Settings
      </Heading>

      {/* Notification Preferences Section */}
      <Box mb={8}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Notification Preferences
        </Text>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text>Email Notifications</Text>
            <Switch
              isChecked={emailNotifications}
              onChange={(e) =>
                handleNotificationUpdate(
                  "email_notifications",
                  e.target.checked
                )
              }
            />
          </HStack>
          <HStack justify="space-between">
            <Text>Event Reminders</Text>
            <Switch
              isChecked={eventReminders}
              onChange={(e) =>
                handleNotificationUpdate("event_reminders", e.target.checked)
              }
            />
          </HStack>
        </VStack>
      </Box>

      <Divider mb={8} />

      {/* Event Preferences Section */}
      <Box mb={8}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Event Preferences
        </Text>

        {/* Preferred Categories */}
        <Box mb={6}>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            Preferred Categories
          </Text>
          <Wrap spacing={2} mb={3}>
            {selectedCategories.map((category) => (
              <WrapItem key={category}>
                <Tag size="md" colorScheme="blue" variant="solid">
                  <TagLabel>{category.replace("_", " ")}</TagLabel>
                  <TagCloseButton onClick={() => removeCategory(category)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
          <Select
            placeholder="Add a category"
            onChange={(e) => {
              if (e.target.value) {
                addCategory(e.target.value);
                e.target.value = "";
              }
            }}
          >
            {availableCategories
              .filter((cat) => !selectedCategories.includes(cat))
              .map((category) => (
                <option key={category} value={category}>
                  {category.replace("_", " ")}
                </option>
              ))}
          </Select>
        </Box>

        {/* Preferred Languages */}
        <Box mb={6}>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            Preferred Languages
          </Text>
          <Wrap spacing={2} mb={3}>
            {selectedLanguages.map((language) => (
              <WrapItem key={language}>
                <Tag size="md" colorScheme="green" variant="solid">
                  <TagLabel>{language}</TagLabel>
                  <TagCloseButton onClick={() => removeLanguage(language)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
          <Select
            placeholder="Add a language"
            onChange={(e) => {
              if (e.target.value) {
                addLanguage(e.target.value);
                e.target.value = "";
              }
            }}
          >
            {availableLanguages
              .filter((lang) => !selectedLanguages.includes(lang))
              .map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
          </Select>
        </Box>

        {/* Preferred Age Groups */}
        <Box mb={6}>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            Preferred Age Groups
          </Text>
          <Wrap spacing={2} mb={3}>
            {selectedAgeGroups.map((ageGroup) => (
              <WrapItem key={ageGroup}>
                <Tag size="md" colorScheme="purple" variant="solid">
                  <TagLabel>{ageGroup.replace("_", " ")}</TagLabel>
                  <TagCloseButton onClick={() => removeAgeGroup(ageGroup)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
          <Select
            placeholder="Add an age group"
            onChange={(e) => {
              if (e.target.value) {
                addAgeGroup(e.target.value);
                e.target.value = "";
              }
            }}
          >
            {availableAgeGroups
              .filter((age) => !selectedAgeGroups.includes(age))
              .map((ageGroup) => (
                <option key={ageGroup} value={ageGroup}>
                  {ageGroup.replace("_", " ")}
                </option>
              ))}
          </Select>
        </Box>

        {/* Max Distance */}
        <Box mb={6}>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            Maximum Travel Distance (km)
          </Text>
          <NumberInput
            value={maxDistance || ""}
            onChange={(valueString) => {
              const value = parseInt(valueString) || null;
              updateMaxDistance(value);
            }}
            min={0}
            max={1000}
          >
            <NumberInputField placeholder="Enter maximum distance (optional)" />
          </NumberInput>
        </Box>
      </Box>

      <Divider mb={8} />

      {/* Security Section */}
      <Box mb={8}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Security
        </Text>
        <Button
          colorScheme="blue"
          variant="outline"
          onClick={() => setPasswordModalOpen(true)}
        >
          Change Password
        </Button>
      </Box>

      <Divider mb={8} />

      {/* Theme Preferences */}
      <Box mb={8}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Theme Preferences
        </Text>
        <ColorModeSwitch />
      </Box>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setPasswordError("");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Current Password</FormLabel>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                  }}
                />
              </FormControl>

              <FormControl isRequired isInvalid={!!passwordError}>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                />
                {passwordError && (
                  <FormErrorMessage>{passwordError}</FormErrorMessage>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setPasswordModalOpen(false);
                setPasswordError("");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              mr={3}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handlePasswordChange}
              isLoading={passwordLoading}
              loadingText="Updating..."
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Settings;
