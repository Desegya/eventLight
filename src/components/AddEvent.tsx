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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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
  FiBriefcase,
  FiSliders,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useCategories } from "../hooks/useCategories";

const LANGUAGES = [
  { value: "english",     label: "English"     },
  { value: "yoruba",      label: "Yoruba"      },
  { value: "igbo",        label: "Igbo"        },
  { value: "hausa",       label: "Hausa"       },
  { value: "pidgin",      label: "Pidgin"      },
  { value: "french",      label: "French"      },
  { value: "multilingual", label: "Multilingual" },
];

const AGE_GROUPS = [
  { value: "all_ages",     label: "All Ages"            },
  { value: "children",     label: "Children (0–12)"     },
  { value: "teenagers",    label: "Teenagers (13–19)"   },
  { value: "young_adults", label: "Young Adults (20–35)" },
  { value: "adults",       label: "Adults (36–60)"      },
  { value: "seniors",      label: "Seniors (60+)"       },
];

interface FormErrors {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  category?: string;
  ticket_price?: string;
}

const SectionCard = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const cardBg      = useColorModeValue("white",    "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const labelColor  = useColorModeValue("gray.500", "gray.400");
  return (
    <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="2xl" overflow="hidden">
      <Box px={6} py={3} borderBottom="1px solid" borderColor={borderColor}>
        <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={labelColor}>
          {label}
        </Text>
      </Box>
      <Box px={6} py={5}>{children}</Box>
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
  const { categories, loading: categoriesLoading } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageBg     = useColorModeValue("gray.50", "gray.900");
  const mutedColor = useColorModeValue("gray.500", "gray.400");

  const [formData, setFormData] = useState({
    title:       "",
    date:        "",
    time:        "",
    end_time:    "",
    location:    "",
    description: "",
    organizer:   "",
    pricing:     "free" as "free" | "paid",
    ticket_price: "" as string,
    capacity:    "" as string,
    category:    "",
    language:    "",
    age_group:   "",
    image:       null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors]             = useState<FormErrors>({});
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
    if (!formData.title.trim())       newErrors.title       = "Event name is required";
    if (!formData.date)               newErrors.date        = "Date is required";
    if (!formData.time)               newErrors.time        = "Start time is required";
    if (!formData.location.trim())    newErrors.location    = "Location is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category)           newErrors.category    = "Category is required";
    if (formData.pricing === "paid" && !formData.ticket_price) {
      newErrors.ticket_price = "Ticket price is required for paid events";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const dateTimeString = `${formData.date}T${formData.time}:00Z`;
      const endDateString  = formData.end_time ? `${formData.date}T${formData.end_time}:00Z` : undefined;

      const createdEvent = await createEvent({
        title:        formData.title,
        description:  formData.description,
        organizer:    formData.organizer || undefined,
        date:         dateTimeString,
        end_date:     endDateString,
        location:     formData.location,
        pricing:      formData.pricing,
        ticket_price: formData.pricing === "paid" && formData.ticket_price ? Number(formData.ticket_price) : null,
        category:     formData.category,
        language:     formData.language || "english",
        age_group:    formData.age_group || "all_ages",
        capacity:     formData.capacity ? Number(formData.capacity) : null,
        image:        formData.image,
      });

      if (createdEvent) {
        toast({
          title: "Event submitted!",
          description: "Your event is pending review and will go live once approved.",
          status: "success",
          duration: 5000,
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

  const dashed = useColorModeValue("gray.200", "gray.600");
  const dashedBg = useColorModeValue("gray.50", "gray.900");
  const dashedHoverBorder = useColorModeValue("brand.400", "brand.400");
  const dashedHoverBg = useColorModeValue("brand.50", "gray.800");

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
                Fill in the details — your event goes live after admin review
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
            loadingText="Submitting…"
          >
            Submit for Review
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

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                  <HStack spacing={1.5}><FieldIcon icon={FiBriefcase} /><Text>Organizer <Text as="span" color={mutedColor} fontWeight="400">(optional)</Text></Text></HStack>
                </FormLabel>
                <Input
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="e.g. Lagos Christian Center"
                  size="md"
                />
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
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                  <HStack spacing={1.5}><FieldIcon icon={FiClock} /><Text>End Time <Text as="span" color={mutedColor} fontWeight="400">(optional)</Text></Text></HStack>
                </FormLabel>
                <Input type="time" name="end_time" value={formData.end_time} onChange={handleChange} />
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

          {/* Category & Audience */}
          <SectionCard label="Category & Audience">
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <FormControl isInvalid={!!errors.category}>
                <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                  <HStack spacing={1.5}><FieldIcon icon={FiTag} /><Text>Category</Text></HStack>
                </FormLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder={categoriesLoading ? "Loading categories…" : "Select category"}
                  isDisabled={categoriesLoading}
                >
                  {categories.map(({ slug, name }) => (
                    <option key={slug} value={slug}>{name}</option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.category}</FormErrorMessage>
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

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>
                  <HStack spacing={1.5}><FieldIcon icon={FiSliders} /><Text>Capacity <Text as="span" color={mutedColor} fontWeight="400">(optional)</Text></Text></HStack>
                </FormLabel>
                <NumberInput min={0} value={formData.capacity} onChange={(v) => setFormData((p) => ({ ...p, capacity: v }))}>
                  <NumberInputField name="capacity" placeholder="Unlimited" borderRadius="md" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </SimpleGrid>
          </SectionCard>

          {/* Cover Image */}
          <SectionCard label="Cover Image">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
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
                borderColor={dashed}
                bg={dashedBg}
                cursor="pointer"
                onClick={() => fileInputRef.current?.click()}
                _hover={{ borderColor: dashedHoverBorder, bg: dashedHoverBg }}
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
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" mb={3}>
                  <HStack spacing={1.5}><FieldIcon icon={FiDollarSign} /><Text>Is this event free or paid?</Text></HStack>
                </FormLabel>
                <RadioGroup
                  value={formData.pricing}
                  onChange={(value) => setFormData((prev) => ({ ...prev, pricing: value as "free" | "paid", ticket_price: "" }))}
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

              {formData.pricing === "paid" && (
                <FormControl isInvalid={!!errors.ticket_price}>
                  <FormLabel fontSize="sm" fontWeight="600" mb={1.5}>Ticket Price (₦)</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.ticket_price}
                    onChange={(v) => { setFormData((p) => ({ ...p, ticket_price: v })); setErrors((p) => ({ ...p, ticket_price: undefined })); }}
                  >
                    <NumberInputField name="ticket_price" placeholder="e.g. 5000" borderRadius="md" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.ticket_price}</FormErrorMessage>
                </FormControl>
              )}
            </VStack>
          </SectionCard>

          <Divider borderColor={useColorModeValue("gray.200", "gray.700")} />

          {/* Bottom actions */}
          <HStack justify="flex-end" spacing={3} pb={8}>
            <Link to="/dashboard/my-events">
              <Button variant="ghost" borderRadius="full" size="md">Cancel</Button>
            </Link>
            <Button
              variant="brand"
              borderRadius="full"
              size="md"
              px={7}
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Submitting…"
            >
              Submit for Review
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default AddEvent;
