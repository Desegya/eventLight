import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
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
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  useToast,
  useColorMode,
  useColorModeValue,
  Icon,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  FiBell,
  FiCalendar,
  FiLock,
  FiMoon,
  FiSun,
  FiEye,
  FiEyeOff,
  FiNavigation,
  FiTag,
  FiGlobe,
  FiUsers,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/auth";
import { useCategories } from "../hooks/useCategories";

const fmt = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const LANGUAGES = ["english", "yoruba", "igbo", "hausa", "pidgin", "french", "multilingual"];
const AGE_GROUPS = ["all_ages", "children", "teenagers", "young_adults", "adults", "seniors"];

const SectionCard = ({ icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  return (
    <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="2xl" overflow="hidden">
      <HStack px={6} py={3.5} borderBottom="1px solid" borderColor={borderColor} spacing={2.5}>
        <Icon as={icon} boxSize={3.5} color="brand.500" />
        <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={mutedColor}>
          {label}
        </Text>
      </HStack>
      <Box px={6} py={5}>{children}</Box>
    </Box>
  );
};

const ToggleRow = ({
  label,
  description,
  isChecked,
  onChange,
}: {
  label: string;
  description: string;
  isChecked: boolean;
  onChange: (val: boolean) => void;
}) => {
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  return (
    <HStack justify="space-between" py={3.5} borderBottom="1px solid" borderColor={borderColor} _last={{ borderBottom: "none" }}>
      <Box>
        <Text fontSize="sm" fontWeight="600">{label}</Text>
        <Text fontSize="xs" color={mutedColor} mt={0.5}>{description}</Text>
      </Box>
      <Switch
        colorScheme="purple"
        isChecked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        flexShrink={0}
      />
    </HStack>
  );
};

const TagPicker = ({
  label,
  icon,
  selected,
  available,
  onAdd,
  onRemove,
  colorScheme,
}: {
  label: string;
  icon: React.ElementType;
  selected: string[];
  available: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  colorScheme: string;
}) => {
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  return (
    <Box py={4} borderBottom="1px solid" borderColor={borderColor} _last={{ borderBottom: "none" }}>
      <HStack spacing={1.5} mb={3}>
        <Icon as={icon} boxSize={3.5} color="brand.500" />
        <Text fontSize="sm" fontWeight="600">{label}</Text>
      </HStack>
      {selected.length > 0 ? (
        <Wrap spacing={2} mb={3}>
          {selected.map((item) => (
            <WrapItem key={item}>
              <Tag size="sm" colorScheme={colorScheme} variant="subtle" borderRadius="full">
                <TagLabel fontSize="xs" fontWeight="600">{fmt(item)}</TagLabel>
                <TagCloseButton onClick={() => onRemove(item)} />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      ) : (
        <Text fontSize="xs" color={mutedColor} mb={3} fontStyle="italic">None selected</Text>
      )}
      <Select
        size="sm"
        borderRadius="lg"
        placeholder={`Add ${label.toLowerCase()}…`}
        onChange={(e) => {
          if (e.target.value) { onAdd(e.target.value); e.target.value = ""; }
        }}
      >
        {available.filter((v) => !selected.includes(v)).map((v) => (
          <option key={v} value={v}>{fmt(v)}</option>
        ))}
      </Select>
    </Box>
  );
};

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast();
  const { categories: allCategories } = useCategories();
  const categorySlugList = allCategories.map((c) => c.slug);

  const mutedColor = useColorModeValue("gray.500", "gray.400");

  // Password modal
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);

  // Preferences
  const [categories, setCategories] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (user) {
      setEmailNotifs(user.email_notifications ?? true);
      setEventReminders(user.event_reminders ?? true);
      setCategories(user.preferred_categories || []);
      setLanguages(user.preferred_languages || []);
      setAgeGroups(user.preferred_age_groups || []);
      setMaxDistance(user.max_distance_km ?? undefined);
    }
  }, [user]);

  const save = async (data: Record<string, unknown>, successMsg?: string) => {
    try {
      await updateProfile(data);
      if (successMsg) toast({ title: successMsg, status: "success", duration: 2000, isClosable: true, position: "top-right" });
    } catch {
      toast({ title: "Failed to save", status: "error", duration: 3000, isClosable: true, position: "top-right" });
    }
  };

  const handleNotifToggle = (field: "email_notifications" | "event_reminders", val: boolean) => {
    if (field === "email_notifications") setEmailNotifs(val);
    else setEventReminders(val);
    save({ [field]: val });
  };

  const addCategory = (v: string) => { const n = [...categories, v]; setCategories(n); save({ preferred_categories: n }, "Preferences saved"); };
  const removeCategory = (v: string) => { const n = categories.filter((c) => c !== v); setCategories(n); save({ preferred_categories: n }); };
  const addLanguage = (v: string) => { const n = [...languages, v]; setLanguages(n); save({ preferred_languages: n }, "Preferences saved"); };
  const removeLanguage = (v: string) => { const n = languages.filter((l) => l !== v); setLanguages(n); save({ preferred_languages: n }); };
  const addAgeGroup = (v: string) => { const n = [...ageGroups, v]; setAgeGroups(n); save({ preferred_age_groups: n }, "Preferences saved"); };
  const removeAgeGroup = (v: string) => { const n = ageGroups.filter((a) => a !== v); setAgeGroups(n); save({ preferred_age_groups: n }); };

  const handleDistanceBlur = () => {
    save({ max_distance_km: maxDistance ?? null }, "Distance saved");
  };

  const handlePasswordChange = async () => {
    setPwError("");
    if (newPw !== confirmPw) { setPwError("Passwords do not match"); return; }
    if (newPw.length < 8) { setPwError("Password must be at least 8 characters"); return; }
    setPwLoading(true);
    try {
      await authService.changePassword({ old_password: currentPw, new_password1: newPw, new_password2: confirmPw });
      toast({ title: "Password updated", status: "success", duration: 3000, isClosable: true, position: "top-right" });
      setCurrentPw(""); setNewPw(""); setConfirmPw(""); setPwOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password";
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  const closePwModal = () => {
    setPwOpen(false); setPwError("");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  if (!user) return null;

  return (
    <Box>
      <VStack spacing={4} align="stretch">

        {/* Notifications */}
        <SectionCard icon={FiBell} label="Notifications">
          <ToggleRow
            label="Email notifications"
            description="Receive event updates and announcements via email"
            isChecked={emailNotifs}
            onChange={(v) => handleNotifToggle("email_notifications", v)}
          />
          <ToggleRow
            label="Event reminders"
            description="Get reminded 24 hours before events you've saved"
            isChecked={eventReminders}
            onChange={(v) => handleNotifToggle("event_reminders", v)}
          />
        </SectionCard>

        {/* Event preferences */}
        <SectionCard icon={FiCalendar} label="Event Preferences">
          <TagPicker
            label="Preferred Categories"
            icon={FiTag}
            selected={categories}
            available={categorySlugList}
            onAdd={addCategory}
            onRemove={removeCategory}
            colorScheme="purple"
          />
          <TagPicker
            label="Preferred Languages"
            icon={FiGlobe}
            selected={languages}
            available={LANGUAGES}
            onAdd={addLanguage}
            onRemove={removeLanguage}
            colorScheme="blue"
          />
          <TagPicker
            label="Preferred Age Groups"
            icon={FiUsers}
            selected={ageGroups}
            available={AGE_GROUPS}
            onAdd={addAgeGroup}
            onRemove={removeAgeGroup}
            colorScheme="green"
          />

          {/* Max distance */}
          <Box pt={4}>
            <HStack spacing={1.5} mb={3}>
              <Icon as={FiNavigation} boxSize={3.5} color="brand.500" />
              <Text fontSize="sm" fontWeight="600">Max travel distance</Text>
            </HStack>
            <HStack align="center" spacing={3}>
              <NumberInput
                value={maxDistance ?? ""}
                onChange={(v) => setMaxDistance(parseInt(v) || undefined)}
                onBlur={handleDistanceBlur}
                min={0}
                max={1000}
                maxW="160px"
                size="sm"
              >
                <NumberInputField borderRadius="lg" placeholder="Any distance" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text fontSize="sm" color={mutedColor}>kilometres</Text>
            </HStack>
            <Text fontSize="xs" color={mutedColor} mt={1.5}>
              Leave blank to see events at any distance
            </Text>
          </Box>
        </SectionCard>

        {/* Security */}
        <SectionCard icon={FiLock} label="Security">
          <HStack justify="space-between" align="center">
            <Box>
              <Text fontSize="sm" fontWeight="600">Password</Text>
              <Text fontSize="xs" color={mutedColor} mt={0.5}>
                Last changed: unknown — update regularly to stay secure
              </Text>
            </Box>
            <Button
              variant="brand-outline"
              size="sm"
              borderRadius="full"
              px={5}
              onClick={() => setPwOpen(true)}
              flexShrink={0}
            >
              Change password
            </Button>
          </HStack>
        </SectionCard>

        {/* Appearance */}
        <SectionCard icon={isDark ? FiMoon : FiSun} label="Appearance">
          <HStack justify="space-between" align="center">
            <Box>
              <Text fontSize="sm" fontWeight="600">
                {isDark ? "Dark mode" : "Light mode"}
              </Text>
              <Text fontSize="xs" color={mutedColor} mt={0.5}>
                {isDark ? "Switch to light for a brighter look" : "Switch to dark for reduced eye strain"}
              </Text>
            </Box>
            <Button
              variant="ghost"
              size="sm"
              borderRadius="full"
              leftIcon={isDark ? <FiSun size={14} /> : <FiMoon size={14} />}
              onClick={toggleColorMode}
              flexShrink={0}
            >
              Switch to {isDark ? "light" : "dark"}
            </Button>
          </HStack>
        </SectionCard>

      </VStack>

      {/* Password Modal */}
      <Modal isOpen={pwOpen} onClose={closePwModal} isCentered>
        <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.400" />
        <ModalContent
          borderRadius="2xl"
          mx={4}
          bg={useColorModeValue("white", "gray.800")}
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <ModalHeader fontWeight="800" letterSpacing="-0.02em" pt={6}>
            Change password
          </ModalHeader>
          <ModalCloseButton top={5} borderRadius="full" />
          <Divider borderColor={useColorModeValue("gray.200", "gray.700")} />
          <ModalBody py={5}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Current password</FormLabel>
                <InputGroup>
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    borderRadius="xl"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Toggle"
                      icon={showCurrent ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      size="xs"
                      variant="ghost"
                      onClick={() => setShowCurrent(!showCurrent)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">New password</FormLabel>
                <InputGroup>
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => { setNewPw(e.target.value); setPwError(""); }}
                    borderRadius="xl"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Toggle"
                      icon={showNew ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      size="xs"
                      variant="ghost"
                      onClick={() => setShowNew(!showNew)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isRequired isInvalid={!!pwError}>
                <FormLabel fontSize="sm" fontWeight="600">Confirm new password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPw}
                    onChange={(e) => { setConfirmPw(e.target.value); setPwError(""); }}
                    borderRadius="xl"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Toggle"
                      icon={showConfirm ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      size="xs"
                      variant="ghost"
                      onClick={() => setShowConfirm(!showConfirm)}
                    />
                  </InputRightElement>
                </InputGroup>
                {pwError && <FormErrorMessage>{pwError}</FormErrorMessage>}
              </FormControl>
            </VStack>
          </ModalBody>

          <Divider borderColor={useColorModeValue("gray.200", "gray.700")} />
          <ModalFooter gap={2} pb={5}>
            <Button variant="ghost" borderRadius="full" onClick={closePwModal}>
              Cancel
            </Button>
            <Button
              variant="brand"
              borderRadius="full"
              onClick={handlePasswordChange}
              isLoading={pwLoading}
              loadingText="Saving…"
              px={6}
            >
              Update password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Settings;
