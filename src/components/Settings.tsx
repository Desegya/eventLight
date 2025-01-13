import {
  Box,
  Button,
  Input,
  Text,
  VStack,
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
} from "@chakra-ui/react";
import { useState } from "react";
import ColorModeSwitch from "./ColorModeSwitch"; // Assuming ColorModeSwitch is available

const AccountSettings = () => {
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Assuming there is a password change function, this is where you handle that logic
    console.log("Password changed successfully");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordModalOpen(false);
  };

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Account Settings
      </Text>

      {/* Change Password Section */}
      <Box mb={6}>
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Change Password
        </Text>
        <Button
          colorScheme="blue"
          variant="outline"
          size="sm"
          onClick={() => setPasswordModalOpen(true)}
        >
          Change Password
        </Button>
      </Box>

      {/* Notification Preferences Section */}
      <Box mb={6}>
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Notification Preferences
        </Text>
        <Button colorScheme="blue" variant="outline" size="sm">
          Update Notification Preferences
        </Button>
      </Box>

      {/* Color Mode Switch */}
      <Box mb={6}>
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Theme Preferences
        </Text>
        <ColorModeSwitch />
      </Box>

      {/* Account Deletion */}
      <Box mb={6}>
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Account Deletion
        </Text>
        <Button colorScheme="red" variant="outline" size="sm">
          Delete Account
        </Button>
      </Box>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
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
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={() => setPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handlePasswordChange}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AccountSettings;
