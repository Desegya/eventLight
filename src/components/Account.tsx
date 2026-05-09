import { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Avatar,
  Button,
  Input,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Divider,
  useColorModeValue,
  useToast,
  Spinner,
  Center,
  Badge,
} from "@chakra-ui/react";
import {
  FiEdit2,
  FiCheck,
  FiX,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiCamera,
  FiGlobe,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { ProfileUpdateData } from "../types/auth";

interface FieldConfig {
  label: string;
  field: keyof ProfileUpdateData;
  icon: React.ElementType;
  placeholder: string;
  readonly?: boolean;
  value: string;
}

const EditableRow = ({
  config,
  onSave,
  isSaving,
}: {
  config: FieldConfig;
  onSave: (field: keyof ProfileUpdateData, value: string) => Promise<void>;
  isSaving: boolean;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(config.value);
  const inputRef = useRef<HTMLInputElement>(null);

  const borderColor = useColorModeValue("gray.100", "gray.700");
  const labelColor = useColorModeValue("gray.500", "gray.400");
  const valueColor = useColorModeValue("gray.800", "white");
  const emptyColor = useColorModeValue("gray.400", "gray.500");
  const iconBg = useColorModeValue("gray.100", "gray.700");

  const startEdit = () => {
    setDraft(config.value);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const cancel = () => {
    setDraft(config.value);
    setEditing(false);
  };

  const save = async () => {
    await onSave(config.field, draft);
    setEditing(false);
  };

  return (
    <HStack
      spacing={4}
      py={4}
      borderBottom="1px solid"
      borderColor={borderColor}
      align="center"
      w="full"
    >
      <Box
        w="34px" h="34px" borderRadius="lg"
        bg={iconBg}
        display="flex" alignItems="center" justifyContent="center"
        flexShrink={0}
      >
        <Icon as={config.icon} boxSize={3.5} color="brand.500" />
      </Box>

      <Box flex={1} minW={0}>
        <Text fontSize="xs" color={labelColor} fontWeight="600" mb={0.5}>
          {config.label}
        </Text>
        {editing ? (
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            size="sm"
            variant="flushed"
            borderColor="brand.400"
            _focus={{ borderColor: "brand.500" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            }}
          />
        ) : (
          <Text
            fontSize="sm"
            fontWeight="500"
            color={config.value ? valueColor : emptyColor}
            fontStyle={config.value ? "normal" : "italic"}
            noOfLines={1}
          >
            {config.value || config.placeholder}
          </Text>
        )}
      </Box>

      {!config.readonly && (
        <HStack spacing={1} flexShrink={0}>
          {editing ? (
            <>
              <IconButton
                aria-label="Save"
                icon={isSaving ? <Spinner size="xs" /> : <FiCheck size={14} />}
                size="xs"
                borderRadius="full"
                colorScheme="green"
                variant="ghost"
                onClick={save}
                isDisabled={isSaving}
              />
              <IconButton
                aria-label="Cancel"
                icon={<FiX size={14} />}
                size="xs"
                borderRadius="full"
                variant="ghost"
                onClick={cancel}
              />
            </>
          ) : (
            <IconButton
              aria-label={`Edit ${config.label}`}
              icon={<FiEdit2 size={13} />}
              size="xs"
              borderRadius="full"
              variant="ghost"
              color={labelColor}
              onClick={startEdit}
            />
          )}
        </HStack>
      )}

      {config.readonly && (
        <Badge fontSize="9px" colorScheme="gray" borderRadius="full" px={2}>
          fixed
        </Badge>
      )}
    </HStack>
  );
};

const Account = () => {
  const { user, updateProfile, loading } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savingField, setSavingField] = useState<string | null>(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const pageBg = useColorModeValue("gray.50", "gray.900");

  const [formData, setFormData] = useState<ProfileUpdateData>({});

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
      });
    }
  }, [user]);

  const handleSave = async (field: keyof ProfileUpdateData, value: string) => {
    setSavingField(field as string);
    try {
      await updateProfile({ [field]: value });
      setFormData((prev) => ({ ...prev, [field]: value }));
      toast({
        title: "Saved",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch {
      toast({
        title: "Failed to save",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setSavingField(null);
    }
  };

  if (!user) {
    return (
      <Center h="200px">
        <Text color={mutedColor} fontSize="sm">Please log in to view your account.</Text>
      </Center>
    );
  }

  const displayName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;
  const initials = `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() || user.email[0].toUpperCase();

  const fields: FieldConfig[] = [
    { label: "First Name", field: "first_name", icon: FiUser, placeholder: "Not set", value: (formData.first_name as string) || "" },
    { label: "Last Name", field: "last_name", icon: FiUser, placeholder: "Not set", value: (formData.last_name as string) || "" },
    { label: "Email address", field: "email" as keyof ProfileUpdateData, icon: FiMail, placeholder: user.email, value: user.email, readonly: true },
    { label: "Phone number", field: "phone_number", icon: FiPhone, placeholder: "Add a phone number", value: (formData.phone_number as string) || "" },
    { label: "Street address", field: "street_address", icon: FiMapPin, placeholder: "Add your street address", value: (formData.street_address as string) || "" },
    { label: "City", field: "city", icon: FiMapPin, placeholder: "Add your city", value: (formData.city as string) || "" },
    { label: "State / Region", field: "state", icon: FiMapPin, placeholder: "Add your state", value: (formData.state as string) || "" },
    { label: "Country", field: "country", icon: FiGlobe, placeholder: "Nigeria", value: (formData.country as string) || "" },
  ];

  return (
    <Box>
      {/* Avatar section */}
      <Box
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="2xl"
        p={6}
        mb={4}
      >
        <Flex align="center" gap={5}>
          <Box position="relative" flexShrink={0}>
            <Avatar
              size="xl"
              name={displayName}
              bg="brand.600"
              color="white"
              fontWeight="800"
              src={undefined}
            >
              {!user.first_name && !user.last_name && (
                <Text fontWeight="800" fontSize="xl">{initials}</Text>
              )}
            </Avatar>
            <IconButton
              aria-label="Change photo"
              icon={<FiCamera size={13} />}
              size="xs"
              borderRadius="full"
              position="absolute"
              bottom={0}
              right={0}
              bg="brand.600"
              color="white"
              _hover={{ bg: "brand.700" }}
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={() => toast({ title: "Photo upload coming soon", status: "info", duration: 2000, position: "top-right" })}
            />
          </Box>
          <Box>
            <Text fontWeight="800" fontSize="lg" letterSpacing="-0.02em">
              {displayName}
            </Text>
            <Text fontSize="sm" color={mutedColor}>{user.email}</Text>
            <Badge mt={1.5} colorScheme="purple" borderRadius="full" px={2.5} py={0.5} fontSize="xs">
              Member
            </Badge>
          </Box>
        </Flex>
      </Box>

      {/* Fields */}
      <Box
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="2xl"
        overflow="hidden"
      >
        <Box px={6} py={3.5} borderBottom="1px solid" borderColor={borderColor}>
          <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={mutedColor}>
            Personal Information
          </Text>
        </Box>
        <Box px={6} pb={2}>
          {fields.map((f) => (
            <EditableRow
              key={f.field as string}
              config={f}
              onSave={handleSave}
              isSaving={savingField === f.field}
            />
          ))}
        </Box>
      </Box>

      <Text fontSize="xs" color={mutedColor} mt={3} textAlign="center">
        Click the pencil icon next to any field to edit it. Changes save immediately.
      </Text>
    </Box>
  );
};

export default Account;
