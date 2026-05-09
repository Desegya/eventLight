import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useEvents } from "../hooks/useEvents";

const ApiTest = () => {
  const { events, loading, error, fetchEvents } = useEvents();
  const [testStatus, setTestStatus] = useState<string>("");

  const testConnection = async () => {
    setTestStatus("Testing connection...");
    try {
      const response = await fetch("http://localhost:8000/api/events/");
      if (response.ok) {
        setTestStatus("✅ Connection successful!");
      } else {
        setTestStatus(`❌ Connection failed: ${response.status}`);
      }
    } catch (error) {
      setTestStatus(`❌ Connection error: ${error}`);
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>API Connection Test</Heading>

      <VStack spacing={4} align="stretch">
        <Button onClick={testConnection} colorScheme="blue">
          Test Backend Connection
        </Button>

        {testStatus && (
          <Text fontSize="lg" fontWeight="bold">
            {testStatus}
          </Text>
        )}

        <Box>
          <Heading size="md" mb={2}>
            Events from API:
          </Heading>

          {loading && <Spinner />}

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {events && events.length > 0 && (
            <VStack align="stretch" spacing={2}>
              {events.slice(0, 3).map((event) => (
                <Box
                  key={event.id}
                  p={3}
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  <Text fontWeight="bold">{event.title}</Text>
                  <Text fontSize="sm" color="gray.600">
                    📍 {event.location}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    🏷️ {event.category.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    🗣️ {event.language} • 👥{" "}
                    {event.age_group.replace(/_/g, " ")}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    📊 Status: {event.approval_status} • 💰 {event.pricing}
                  </Text>
                </Box>
              ))}
              {events.length > 3 && (
                <Text fontSize="sm" color="gray.500">
                  ... and {events.length - 3} more events
                </Text>
              )}
            </VStack>
          )}

          {events && events.length === 0 && !loading && (
            <Text>No events found.</Text>
          )}
        </Box>

        <Button onClick={fetchEvents} variant="outline">
          Refresh Events
        </Button>
      </VStack>
    </Box>
  );
};

export default ApiTest;
