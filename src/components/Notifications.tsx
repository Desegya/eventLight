import {
  Box,
  Text,
  HStack,
  Button,
  VStack,
  IconButton,
  Tooltip,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiBell, FiTrash, FiArrowLeft } from "react-icons/fi";

type Notification = {
  id: number;
  icon: JSX.Element;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  details: string;
  eventImageUrl?: string; // Optional event image
};

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
  onShowDetails,
  isExpanded,
}: {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  onShowDetails: (id: number) => void;
  isExpanded: boolean;
}) => {
  const textColor = "white";
  const buttonBgColor = useColorModeValue("blue.800", "blue.600");

  return (
    <HStack
      p={4}
      borderRadius="md"
      spacing={4}
      w="100%"
      justify="space-between"
    >
      {/* Only show the title and icon if not expanded */}
      {!isExpanded && (
        <HStack spacing={3}>
          {notification.icon}
          <Text
            fontSize="md"
            fontWeight={notification.isRead ? "normal" : "bold"}
          >
            {notification.title}
          </Text>
        </HStack>
      )}

      {!isExpanded && (
        <Text fontSize="sm" color="gray.500">
          {notification.timestamp}
        </Text>
      )}

      {/* Show buttons for mark as read and delete only when not expanded */}
      {!isExpanded && (
        <HStack spacing={2}>
          {!notification.isRead && (
            <Tooltip label="Mark as Read" aria-label="Mark as Read Tooltip">
              <IconButton
                aria-label="Mark as read"
                icon={<FaCheck />}
                onClick={() => onMarkAsRead(notification.id)}
                size="sm"
                variant="ghost"
              />
            </Tooltip>
          )}
          <Tooltip
            label="Delete Notification"
            aria-label="Delete Notification Tooltip"
          >
            <IconButton
              aria-label="Delete"
              icon={<FiTrash />}
              onClick={() => onDelete(notification.id)}
              size="sm"
              variant="ghost"
              color="red.500"
            />
          </Tooltip>
          {/* See Details button */}
          <Button
            display={{ base: "none", md: "block" }}
            size="sm"
            variant="link"
            onClick={() => onShowDetails(notification.id)}
          >
            {isExpanded ? "Hide Details" : "See Details"}
          </Button>
        </HStack>
      )}

      {/* Expanded notification view */}
      {isExpanded && (
        <Box mt={2} borderRadius="md" w="100%">
          {/* Back Arrow Icon */}
          <HStack mb={3}>
            <IconButton
              display={{ base: "none", md: "block" }}
              aria-label="Back"
              icon={<FiArrowLeft />}
              onClick={() => onShowDetails(notification.id)} // Collapse the notification
              size="lg"
              variant="ghost"
            />
            <Text fontSize="xl" fontWeight="bold">
              {notification.title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {notification.timestamp}
            </Text>
          </HStack>

          {/* Notification details */}
          <Text fontSize="md" mb={3}>
            {notification.details}
          </Text>

          {/* Event image and button (only show if the image is provided) */}
          {notification.eventImageUrl && (
            <Image
              src={notification.eventImageUrl}
              alt="Event Image"
              mt={3}
              mb={4}
              boxSize="100%"
              objectFit="cover"
            />
          )}

          <Button
            bg={buttonBgColor}
            color={textColor}
            variant="outline"
            onClick={() => console.log("View event details clicked")}
          >
            View Event Details
          </Button>
        </Box>
      )}
    </HStack>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      icon: <FiBell />,
      title: "Shiloh 2024 Reminder",
      message:
        "The event you liked, Shiloh 2024 starts in a week. Will you be attending?",
      timestamp: "2 hours ago",
      isRead: false,
      details:
        "Shiloh 2024 starts in a week. Make sure you're ready to attend the event of the year. Don't miss out!",
      eventImageUrl: "http://dummyimage.com/200x100.png/dddddd/000000", // Example event image
    },
    // Add more notifications if necessary
  ]);

  const [expandedNotificationId, setExpandedNotificationId] = useState<
    number | null
  >(null);

  const markAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.id !== id)
    );
  };

  const showDetails = (id: number) => {
    setExpandedNotificationId((prev) => (prev === id ? null : id));
  };

  return (
    <Box p={4}>
      <Text
        fontSize="xl"
        textAlign={{ base: "center", md: "left" }}
        fontWeight="bold"
        mb={4}
      >
        Notifications
      </Text>
      <VStack spacing={4}>
        {notifications.length === 0 ? (
          <Text>No notifications</Text>
        ) : (
          notifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              onShowDetails={showDetails}
              isExpanded={expandedNotificationId === notif.id}
            />
          ))
        )}
      </VStack>
    </Box>
  );
};

export default Notifications;
