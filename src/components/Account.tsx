import { useState, useEffect, useRef } from "react";
import {
  Box,
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
  SimpleGrid,
  useColorModeValue,
  useToast,
  Badge,
  Divider,
} from "@chakra-ui/react";
import {
  FiCamera,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiGlobe,
  FiCheck,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { ProfileUpdateData } from "../types/auth";

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const cardBg    = useColorModeValue("white",    "gray.800");
  const border    = useColorModeValue("gray.200", "gray.700");
  const labelColor = useColorModeValue("gray.500", "gray.400");
  return (
    <Box bg={cardBg} border="1px solid" borderColor={border} borderRadius="2xl" overflow="hidden">
      <Box px={6} py={3.5} borderBottom="1px solid" borderColor={border}>
        <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={labelColor}>
          {title}
        </Text>
      </Box>
      <Box px={6} py={5}>{children}</Box>
    </Box>
  );
};

const Account = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutedColor  = useColorModeValue("gray.500", "gray.400");
  const cardBg      = useColorModeValue("white",    "gray.800");
  const border      = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.900", "white");

  // Separate draft states per section so saves are scoped
  const [nameDraft, setNameDraft] = useState({ first_name: "", last_name: "" });
  const [contactDraft, setContactDraft] = useState({ phone_number: "" });
  const [addressDraft, setAddressDraft] = useState({ street_address: "", city: "", state: "", country: "" });

  const [savingName,    setSavingName]    = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (user) {
      setNameDraft({ first_name: user.first_name || "", last_name: user.last_name || "" });
      setContactDraft({ phone_number: user.phone_number || "" });
      setAddressDraft({
        street_address: user.street_address || "",
        city:    user.city    || "",
        state:   user.state   || "",
        country: user.country || "Nigeria",
      });
    }
  }, [user]);

  const saveSection = async (
    data: Partial<ProfileUpdateData>,
    setSaving: (v: boolean) => void
  ) => {
    setSaving(true);
    try {
      await updateProfile(data);
      toast({ title: "Saved", status: "success", duration: 2000, isClosable: true, position: "top-right" });
    } catch {
      toast({ title: "Failed to save", status: "error", duration: 3000, isClosable: true, position: "top-right" });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const displayName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;

  return (
    <Box>
      {/* ── Profile header ── */}
      <Box bg={cardBg} border="1px solid" borderColor={border} borderRadius="2xl" p={6} mb={5}>
        <HStack spacing={5} align="center" flexWrap="wrap" gap={4}>
          {/* Avatar */}
          <Box position="relative" flexShrink={0}>
            <Avatar
              size="xl"
              name={displayName}
              bg="brand.600"
              color="white"
              fontWeight="800"
            />
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
              onChange={() =>
                toast({ title: "Photo upload coming soon", status: "info", duration: 2000, position: "top-right" })
              }
            />
          </Box>

          {/* Name + email */}
          <Box flex={1} minW={0}>
            <Text fontWeight="800" fontSize="xl" letterSpacing="-0.02em" color={headingColor} noOfLines={1}>
              {displayName}
            </Text>
            <HStack spacing={1.5} mt={1}>
              <Icon as={FiMail} boxSize={3.5} color={mutedColor} />
              <Text fontSize="sm" color={mutedColor} noOfLines={1}>{user.email}</Text>
            </HStack>
            <Badge mt={2} colorScheme="purple" borderRadius="full" px={2.5} py={0.5} fontSize="xs">
              Member
            </Badge>
          </Box>
        </HStack>
      </Box>

      <VStack spacing={4} align="stretch">

        {/* ── Name section ── */}
        <SectionCard title="Name">
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mb={4}>
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="600" color={mutedColor} mb={1}>
                <HStack spacing={1}><Icon as={FiUser} boxSize={3} /><Text>First name</Text></HStack>
              </FormLabel>
              <Input
                value={nameDraft.first_name}
                onChange={(e) => setNameDraft((p) => ({ ...p, first_name: e.target.value }))}
                placeholder="Your first name"
                size="md"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="600" color={mutedColor} mb={1}>
                <HStack spacing={1}><Icon as={FiUser} boxSize={3} /><Text>Last name</Text></HStack>
              </FormLabel>
              <Input
                value={nameDraft.last_name}
                onChange={(e) => setNameDraft((p) => ({ ...p, last_name: e.target.value }))}
                placeholder="Your last name"
                size="md"
              />
            </FormControl>
          </SimpleGrid>
          <Button
            variant="brand"
            size="sm"
            borderRadius="full"
            px={5}
            leftIcon={<FiCheck size={13} />}
            isLoading={savingName}
            loadingText="Saving…"
            onClick={() => saveSection(nameDraft, setSavingName)}
          >
            Save name
          </Button>
        </SectionCard>

        {/* ── Email (read-only) ── */}
        <SectionCard title="Email address">
          <HStack spacing={3} p={3} borderRadius="xl" bg={useColorModeValue("gray.50", "gray.900")}>
            <Icon as={FiMail} boxSize={4} color="brand.500" flexShrink={0} />
            <Box flex={1} minW={0}>
              <Text fontSize="sm" fontWeight="600" noOfLines={1}>{user.email}</Text>
              <Text fontSize="xs" color={mutedColor} mt={0.5}>
                Your email cannot be changed after registration
              </Text>
            </Box>
            <Badge colorScheme="gray" borderRadius="full" fontSize="10px" px={2} flexShrink={0}>
              fixed
            </Badge>
          </HStack>
        </SectionCard>

        {/* ── Contact ── */}
        <SectionCard title="Contact">
          <FormControl mb={4}>
            <FormLabel fontSize="xs" fontWeight="600" color={mutedColor} mb={1}>
              <HStack spacing={1}><Icon as={FiPhone} boxSize={3} /><Text>Phone number</Text></HStack>
            </FormLabel>
            <Input
              value={contactDraft.phone_number}
              onChange={(e) => setContactDraft({ phone_number: e.target.value })}
              placeholder="+234 800 000 0000"
              size="md"
              type="tel"
            />
          </FormControl>
          <Button
            variant="brand"
            size="sm"
            borderRadius="full"
            px={5}
            leftIcon={<FiCheck size={13} />}
            isLoading={savingContact}
            loadingText="Saving…"
            onClick={() => saveSection(contactDraft, setSavingContact)}
          >
            Save contact
          </Button>
        </SectionCard>

        {/* ── Address ── */}
        <SectionCard title="Location">
          <VStack spacing={4} align="stretch" mb={4}>
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="600" color={mutedColor} mb={1}>
                <HStack spacing={1}><Icon as={FiMapPin} boxSize={3} /><Text>Street address</Text></HStack>
              </FormLabel>
              <Input
                value={addressDraft.street_address}
                onChange={(e) => setAddressDraft((p) => ({ ...p, street_address: e.target.value }))}
                placeholder="12 Church Street"
                size="md"
              />
            </FormControl>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="600" color={mutedColor} mb={1}>City</FormLabel>
                <Input
                  value={addressDraft.city}
                  onChange={(e) => setAddressDraft((p) => ({ ...p, city: e.target.value }))}
                  placeholder="Lagos"
                  size="md"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="600" color={mutedColor} mb={1}>State</FormLabel>
                <Input
                  value={addressDraft.state}
                  onChange={(e) => setAddressDraft((p) => ({ ...p, state: e.target.value }))}
                  placeholder="Lagos State"
                  size="md"
                />
              </FormControl>
            </SimpleGrid>
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="600" color={mutedColor} mb={1}>
                <HStack spacing={1}><Icon as={FiGlobe} boxSize={3} /><Text>Country</Text></HStack>
              </FormLabel>
              <Input
                value={addressDraft.country}
                onChange={(e) => setAddressDraft((p) => ({ ...p, country: e.target.value }))}
                placeholder="Nigeria"
                size="md"
              />
            </FormControl>
          </VStack>
          <Button
            variant="brand"
            size="sm"
            borderRadius="full"
            px={5}
            leftIcon={<FiCheck size={13} />}
            isLoading={savingAddress}
            loadingText="Saving…"
            onClick={() => saveSection(addressDraft, setSavingAddress)}
          >
            Save location
          </Button>
        </SectionCard>

        {/* ── Danger zone ── */}
        <SectionCard title="Danger zone">
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
            <Box>
              <Text fontSize="sm" fontWeight="600" color="red.500">Delete account</Text>
              <Text fontSize="xs" color={mutedColor} mt={0.5}>
                Permanently remove your account and all your data. This cannot be undone.
              </Text>
            </Box>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              borderRadius="full"
              px={5}
              onClick={() =>
                toast({ title: "Account deletion — coming soon", status: "info", duration: 3000, position: "top-right" })
              }
            >
              Delete account
            </Button>
          </HStack>
        </SectionCard>

      </VStack>
    </Box>
  );
};

export default Account;
