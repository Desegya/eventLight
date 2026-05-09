import { useState, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  Text,
  RadioGroup,
  Radio,
  Icon,
  IconButton,
  Image,
  Divider,
  SimpleGrid,
  useColorModeValue,
  useToast,
  Flex,
  Badge,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiTag,
  FiUsers,
  FiUploadCloud,
  FiDollarSign,
  FiType,
  FiAlignLeft,
  FiGlobe,
  FiX,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";

const CATEGORIES = [
  "worship", "conference", "seminar", "fellowship",
  "outreach", "youth", "children", "prayer", "music", "teaching",
];

const EVENT_TYPES = [
  { value: "church_service", label: "Church Service" },
  { value: "bible_study", label: "Bible Study" },
  { value: "prayer_meeting", label: "Prayer Meeting" },
  { value: "fellowship", label: "Fellowship" },
  { value: "conference", label: "Conference" },
  { value: "seminar", label: "Seminar" },
  { value: "outreach", label: "Outreach" },
  { value: "special_event", label: "Special Event" },
];

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "yoruba", label: "Yoruba" },
  { value: "igbo", label: "Igbo" },
  { value: "hausa", label: "Hausa" },
  { value: "pidgin", label: "Pidgin" },
  { value: "french", label: "French" },
  { value: "multilingual", label: "Multilingual" },
];

const AGE_GROUPS = [
  { value: "all_ages", label: "All Ages" },
  { value: "children", label: "Children (0–12)" },
  { value: "teenagers", label: "Teenagers (13–19)" },
  { value: "young_adults", label: "Young Adults (20–35)" },
  { value: "adults", label: "Adults (36–60)" },
  { value: "seniors", label: "Seniors (60+)" },
];

interface FormErrors {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  category?: string;
}

const SectionCard = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const labelColor = useColorModeValue("gray.500", "gray.400");
  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      overflow="hidden"
    >
      <Box px={6} py={3} borderBottom="1px solid" borderColor={borderColor}>
        <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={labelColor}>
          {label}
        </Text>
      </Box>
      <Box px={6} py={5}>
        {children}
      </Box>
    </Box>
  );
};

const FieldIcon = ({ icon }: { icon: React.ElementType }) => {
  const color = useColorModeValue("gray.400", "gray.500");
  return <Icon as={icon} boxSize={4} color={color} />;
};

const AddEvent = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { createEvent } = useEvents();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const mutedColor = useColorModeValue("gray.500", "gray.400");

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    pricing: "free" as "free" | "paid",
    category: "",
    event_type: "",
    language: "",
    age_group: "",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "Event name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const dateTimeString = `${formData.date}T${formData.time}:00Z`;
      const createdEvent = await createEvent({
        title: formData.title,
        description: formData.description,
        date: dateTimeString,
        location: formData.location,
        pricing: formData.pricing,
        category: formData.category,
        event_type: formData.event_type,
        language: formData.language,
        age_group: formData.age_group,
        image: formData.image,
      });

      if (createdEvent) {
        toast({
          title: "Event created!",
          description: "Your event is now live on eventlight.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        navigate("/dashboard/my-events");
      }
    } catch {
      toast({
        title: "Failed to create event",
        description: "Please check your details and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box minH="100vh" bg={pageBg}>
      {/* Page header */}
      <Box
        bg={useColorModeValue("white", "gray.800")}
        borderBottom="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        px={{ base: 4, md: 8 }}
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex maxW="860px" mx="auto" align="center" justify="space-between">
          <HStack spacing={4}>
            <Link to="/dashboard/my-events">
              <IconButton
                aria-label="Back"
                icon={<FiArrowLeft size={18} />}
                variant="ghost"
                borderRadius="full"
                size="sm"
              />
            </Link>
            <Box>
              <Text fontWeight="800" fontSize="lg" letterSpacing="-0.03em" lineHeight="1.1">
                Create Event
              </Text>
              <Text fontSize="xs" color={mutedColor}>
                Fill in the details below to publish your event
              </Text>
            </Box>
          </HStack>
          <Button
            variant="brand"
            borderRadius="full"
            size="sm"
            px={5}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Publishing…"
          >
            Publish Event
          </Button>
        </Flex>
      </Box>

      {/* Form body */}
      <Box maxW="860px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <VStack spacing={5} align="stretch">

          {/* Basic Info */}
          <SectionCard label="Basic Information">
            <VStack spacing={5} align="stretch">
              <FormControl isInvalid={!!errors.title}>
                <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                  <HStack spacing={1.5}><FieldIcon icon={FiType} /><Text>Event Name</Text></HStack>
                </FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Sunday Worship Night"
                  size="md"
                />
                <FormErrorMessage>{errors.title}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                  <HStack spacing={1.5}><FieldIcon icon={FiAlignLeft} /><Text>Description</Text></HStack>
                </FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell people what to expect at your event…"
                  rows={4}
                  resize="vertical"
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>
            </VStack>
          </SectionCard>

          {/* Date & Time */}
          <SectionCard label="Date & Time">
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <FormControl isInvalid={!!errors.date}>
                <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                  <HStack spacing={1.5}><FieldIcon icon={FiCalendar} /><Text>Date</Text></HStack>
                </FormLabel>
                <Input type="date" name="date" value={formData.date} onChange={handleChange} />
                <FormErrorMessage>{errors.date}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.time}>
                <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                  <HStack spacing={1.5}><FieldIcon icon={FiClock} /><Text>Start Time</Text></HStack>
                </FormLabel>
                <Input type="time" name="time" value={formData.time} onChange={handleChange} />
                <FormErrorMessage>{errors.time}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </SectionCard>

          {/* Location */}
          <SectionCard label="Location">
            <FormControl isInvalid={!!errors.location}>
              <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                <HStack spacing={1.5}><FieldIcon icon={FiMapPin} /><Text>Venue / Address</Text></HStack>
              </FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Faith Tabernacle, 12 Church Street, Lagos"
              />
              <FormErrorMessage>{errors.location}</FormErrorMessage>
            </FormControl>
          </SectionCard>

          {/* Category & Details */}
          <SectionCard label="Category & Audience">
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <FormControl isInvalid={!!errors.category}>
                <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                  <HStack spacing={1.5}><FieldIcon icon={FiTag} /><Text>Category</Text></HStack>
                </FormLabel>
                <Select name="category" value={formData.category} onChange={handleChange} placeholder="Select category">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.category}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                  <HStack spacing={1.5}><FieldIcon icon={FiTag} /><Text>Event Type</Text></HStack>
                </FormLabel>
                <Select name="event_type" value={formData.event_type} onChange={handleChange} placeholder="Select type">
                  {EVENT_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                  <HStack spacing={1.5}><FieldIcon icon={FiGlobe} /><Text>Language</Text></HStack>
                </FormLabel>
                <Select name="language" value={formData.language} onChange={handleChange} placeholder="Select language">
                  {LANGUAGES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                  <HStack spacing={1.5}><FieldIcon icon={FiUsers} /><Text>Age Group</Text></HStack>
                </FormLabel>
                <Select name="age_group" value={formData.age_group} onChange={handleChange} placeholder="Select age group">
                  {AGE_GROUPS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          </SectionCard>

          {/* Cover Image */}
          <SectionCard label="Cover Image">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <Box position="relative" borderRadius="xl" overflow="hidden">
                <Image
                  src={imagePreview}
                  w="full"
                  maxH="260px"
                  objectFit="cover"
                  borderRadius="xl"
                />
                <IconButton
                  aria-label="Remove image"
                  icon={<FiX size={14} />}
                  size="sm"
                  borderRadius="full"
                  position="absolute"
                  top={3}
                  right={3}
                  bg="blackAlpha.700"
                  color="white"
                  _hover={{ bg: "blackAlpha.900" }}
                  onClick={clearImage}
                />
                <Badge
                  position="absolute"
                  bottom={3}
                  left={3}
                  colorScheme="purple"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="xs"
                >
                  {formData.image?.name}
                </Badge>
              </Box>
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                gap={3}
                py={10}
                borderRadius="xl"
                border="2px dashed"
                borderColor={useColorModeValue("gray.200", "gray.600")}
                bg={useColorModeValue("gray.50", "gray.900")}
                cursor="pointer"
                onClick={() => fileInputRef.current?.click()}
                _hover={{ borderColor: "brand.400", bg: useColorModeValue("brand.50", "gray.800") }}
                transition="all 0.2s ease"
              >
                <Box
                  w="48px" h="48px" borderRadius="full"
                  bg={useColorModeValue("gray.100", "gray.700")}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Icon as={FiUploadCloud} boxSize={5} color="brand.500" />
                </Box>
                <Box textAlign="center">
                  <Text fontWeight="600" fontSize="sm">Click to upload a cover image</Text>
                  <Text fontSize="xs" color={mutedColor} mt={0.5}>PNG, JPG or WEBP — max 10 MB</Text>
                </Box>
                <Button variant="brand-outline" size="xs" borderRadius="full" px={4} pointerEvents="none">
                  Browse files
                </Button>
              </Flex>
            )}
          </SectionCard>

          {/* Pricing */}
          <SectionCard label="Pricing">
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" mb={3}>
                <HStack spacing={1.5}><FieldIcon icon={FiDollarSign} /><Text>Is this event free or paid?</Text></HStack>
              </FormLabel>
              <RadioGroup
                value={formData.pricing}
                onChange={(value) => setFormData((prev) => ({ ...prev, pricing: value as "free" | "paid" }))}
              >
                <HStack spacing={6}>
                  <Radio value="free" colorScheme="purple">
                    <Text fontSize="sm" fontWeight="500">Free</Text>
                  </Radio>
                  <Radio value="paid" colorScheme="purple">
                    <Text fontSize="sm" fontWeight="500">Paid</Text>
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
          </SectionCard>

          <Divider borderColor={useColorModeValue("gray.200", "gray.700")} />

          {/* Bottom actions */}
          <HStack justify="flex-end" spacing={3} pb={8}>
            <Link to="/dashboard/my-events">
              <Button variant="ghost" borderRadius="full" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              variant="brand"
              borderRadius="full"
              size="md"
              px={7}
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Publishing…"
            >
              Publish Event
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default AddEvent;
