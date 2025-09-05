import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  Heading,
  Text,
  RadioGroup,
  Radio,
  HStack,
  IconButton,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import {
  BiArrowBack,
  BiCalendar,
  BiTime,
  BiMap,
  BiText,
  BiCategory,
  BiUser,
  BiImage,
  BiMoney,
} from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";

const AddEvent = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { createEvent } = useEvents();

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Combine date and time for the API
      const dateTimeString = `${formData.date}T${formData.time}:00Z`;

      const eventData = {
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
      };

      const createdEvent = await createEvent(eventData);

      if (createdEvent) {
        toast({
          title: "Event created successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Failed to create event",
        description: "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={6}>
      {/* Back Button */}
      <Box mb={4}>
        <Link to="/">
          <IconButton
            icon={<BiArrowBack />}
            aria-label="Back to homepage"
            variant="ghost"
            size="lg"
          />
        </Link>
      </Box>

      {/* Header Section */}
      <Heading as="h1" size="xl" mb={4}>
        Add New Event
      </Heading>
      <Text fontSize="lg" color="gray.500" mb={6}>
        Fill in the details below to add a new event to EventLight.
      </Text>

      {/* Event Form */}
      <VStack spacing={4} align="stretch">
        {/* Event Name */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiText />
              <Text>Event Name</Text>
            </HStack>
          </FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event name"
          />
        </FormControl>

        {/* Date */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiCalendar />
              <Text>Date</Text>
            </HStack>
          </FormLabel>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </FormControl>

        {/* Start Time */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiTime />
              <Text>Start Time</Text>
            </HStack>
          </FormLabel>
          <Input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </FormControl>

        {/* Location */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiMap />
              <Text>Location</Text>
            </HStack>
          </FormLabel>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
          />
        </FormControl>

        {/* Description */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiText />
              <Text>Description</Text>
            </HStack>
          </FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description"
          />
        </FormControl>

        {/* Category */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiCategory />
              <Text>Category</Text>
            </HStack>
          </FormLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Select category"
          >
            <option value="worship">Worship</option>
            <option value="conference">Conference</option>
            <option value="seminar">Seminar</option>
            <option value="fellowship">Fellowship</option>
            <option value="outreach">Outreach</option>
            <option value="youth">Youth</option>
            <option value="children">Children</option>
            <option value="prayer">Prayer</option>
            <option value="music">Music</option>
            <option value="teaching">Teaching</option>
          </Select>
        </FormControl>

        {/* Event Type */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiCategory />
              <Text>Event Type</Text>
            </HStack>
          </FormLabel>
          <Select
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            placeholder="Select event type"
          >
            <option value="church_service">Church Service</option>
            <option value="bible_study">Bible Study</option>
            <option value="prayer_meeting">Prayer Meeting</option>
            <option value="fellowship">Fellowship</option>
            <option value="conference">Conference</option>
            <option value="seminar">Seminar</option>
            <option value="outreach">Outreach</option>
            <option value="special_event">Special Event</option>
          </Select>
        </FormControl>

        {/* Language */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiText />
              <Text>Language</Text>
            </HStack>
          </FormLabel>
          <Select
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="Select language"
          >
            <option value="english">English</option>
            <option value="yoruba">Yoruba</option>
            <option value="igbo">Igbo</option>
            <option value="hausa">Hausa</option>
            <option value="pidgin">Pidgin</option>
            <option value="french">French</option>
            <option value="multilingual">Multilingual</option>
          </Select>
        </FormControl>

        {/* Age Group */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiUser />
              <Text>Age Group</Text>
            </HStack>
          </FormLabel>
          <Select
            name="age_group"
            value={formData.age_group}
            onChange={handleChange}
            placeholder="Select age group"
          >
            <option value="all_ages">All Ages</option>
            <option value="children">Children (0-12)</option>
            <option value="teenagers">Teenagers (13-19)</option>
            <option value="young_adults">Young Adults (20-35)</option>
            <option value="adults">Adults (36-60)</option>
            <option value="seniors">Seniors (60+)</option>
          </Select>
        </FormControl>

        {/* Image Upload */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiImage />
              <Text>Event Image</Text>
            </HStack>
          </FormLabel>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </FormControl>
        {/* Pricing */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiMoney />
              <Text>Is this event free or paid?</Text>
            </HStack>
          </FormLabel>
          <RadioGroup
            name="pricing"
            value={formData.pricing}
            onChange={(value) =>
              setFormData({ ...formData, pricing: value as "free" | "paid" })
            }
          >
            <HStack spacing={4}>
              <Radio value="free">Free</Radio>
              <Radio value="paid">Paid</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        {/* Submit Button */}
        <Button
          bg="blue.800"
          color="white"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          loadingText="Creating Event..."
        >
          Create Event
        </Button>
      </VStack>
    </Box>
  );
};

export default AddEvent;
