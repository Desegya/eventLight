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

const AddEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = location.state || {
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventDescription: "",
    eventCategory: "",
    eventOrganizer: "",
    newOrganizer: "",
    eventImage: "",
    eventPricing: "free",
    price: "",
  };

  const [formData, setFormData] = useState(initialState);


  const [organizers, setOrganizers] = useState([
    "Organizer A",
    "Organizer B",
    "Organizer C",
  ]);

  

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
    if (file) {
      // Create a temporary URL for the image file
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, eventImage: imageUrl }); // Save the URL, not the file object
    }
  };

  const handleSubmit = () => {
    // Navigate to Preview Page with formData
    navigate("/events/preview-event", { state: formData });
  };

  const handleAddOrganizer = () => {
    if (formData.newOrganizer && !organizers.includes(formData.newOrganizer)) {
      setOrganizers([...organizers, formData.newOrganizer]);
      setFormData({
        ...formData,
        eventOrganizer: formData.newOrganizer,
        newOrganizer: "",
      });
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
            name="eventName"
            value={formData.eventName}
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
            name="eventDate"
            value={formData.eventDate}
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
            name="eventTime"
            value={formData.eventTime}
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
            name="eventLocation"
            value={formData.eventLocation}
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
            name="eventDescription"
            value={formData.eventDescription}
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
            name="eventCategory"
            value={formData.eventCategory}
            onChange={handleChange}
            placeholder="Select category"
          >
            <option value="conference">Conference</option>
            <option value="concert">Concert</option>
            <option value="workshop">Workshop</option>
          </Select>
        </FormControl>

        {/* Organizer */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiUser />
              <Text>Event Organizer</Text>
            </HStack>
          </FormLabel>
          <Select
            name="eventOrganizer"
            value={formData.eventOrganizer}
            onChange={handleChange}
            placeholder="Select organizer"
          >
            {organizers.map((organizer, index) => (
              <option key={index} value={organizer}>
                {organizer}
              </option>
            ))}
            <option value="add-new-organizer">Add New Organizer</option>
          </Select>
          {formData.eventOrganizer === "add-new-organizer" && (
            <Box mt={2}>
              <FormControl>
                <FormLabel>
                  <HStack>
                    <BiUser />
                    <Text>New Organizer Name</Text>
                  </HStack>
                </FormLabel>
                <Input
                  name="newOrganizer"
                  value={formData.newOrganizer}
                  onChange={handleChange}
                  placeholder="Enter new organizer name"
                />
                <Button mt={2} colorScheme="blue" onClick={handleAddOrganizer}>
                  Add Organizer
                </Button>
              </FormControl>
            </Box>
          )}
        </FormControl>

        {/* Is Paid */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiMoney />
              <Text>Is this event free or paid?</Text>
            </HStack>
          </FormLabel>
          <RadioGroup
            name="eventPricing"
            value={formData.eventPricing}
            onChange={(value) => setFormData({ ...formData, eventPricing: value })}
          >
            <HStack spacing={4}>
              <Radio value="free">Free</Radio>
              <Radio value="paid">Paid</Radio>
            </HStack>
          </RadioGroup>
          {formData.eventPricing === "paid" && (
            <FormControl mt={4}>
              <FormLabel>
                <HStack>
                  <BiMoney />
                  <Text>Price (in Naira)</Text>
                </HStack>
              </FormLabel>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter event price"
                min="0"
              />
            </FormControl>
          )}
        </FormControl>

        {/* Event Image */}
        <FormControl>
          <FormLabel>
            <HStack>
              <BiImage />
              <Text>Event Image</Text>
            </HStack>
          </FormLabel>
          <Input
            type="file"
            accept="image/*"
            name="eventImage"
            onChange={handleImageChange}
          />
        </FormControl>

        {/* Submit Button */}
        <Button bg="blue.800" color="white" onClick={handleSubmit}>
          Add Event
        </Button>
      </VStack>
    </Box>
  );
};

export default AddEvent;
