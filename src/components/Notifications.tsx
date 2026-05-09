import {
  Box,
  Text,
  HStack,
  VStack,
  Button,
  Icon,
  IconButton,
  Tooltip,
  Badge,
  Collapse,
  Divider,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FiBell,
  FiTrash2,
  FiCheck,
  FiCheckCircle,
  FiCalendar,
  FiHeart,
  FiBookmark,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

type NotifType = "reminder" | "like" | "save" | "info" | "event";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  detail: string;
  timestamp: string;
  isRead: boolean;
}

const TYPE_META: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  reminder: { icon: FiCalendar, color: "brand.500", bg: "brand.50" },
  like:     { icon: FiHeart,    color: "red.400",   bg: "red.50"   },
  save:     { icon: FiBookmark, color: "teal.500",  bg: "teal.50"  },
  info:     { icon: FiInfo,     color: "blue.500",  bg: "blue.50"  },
  event:    { icon: FiBell,     color: "orange.500", bg: "orange.50" },
};

const SEED: Notification[] = [
  {
    id: 1,
    type: "reminder",
    title: "Event starts tomorrow",
    body: "Shiloh 2024 is tomorrow. Don't miss it!",
    detail: "You saved this event earlier. It kicks off tomorrow at 9 AM at Faith Arena, Ota. Make sure you plan your travel.",
    timestamp: "2 hours ago",
    isRead: false,
  },
  {
    id: 2,
    type: "event",
    title: "New event in your area",
    body: "A worship night just dropped near you.",
    detail: "Kingdom Worship Night has been added near Lagos. It matches your preferred categories. Check it out before spots fill up.",
    timestamp: "5 hours ago",
    isRead: false,
  },
  {
    id: 3,
    type: "info",
    title: "Welcome to eventlight",
    body: "Discover events that move you.",
    detail: "Thanks for joining eventlight. Browse thousands of events near you — worship nights, conferences, fellowships, and more. Save, like, and share the ones you love.",
    timestamp: "Yesterday",
    isRead: true,
  },
];

const NotifCard = ({
  notif,
  onMarkRead,
  onDelete,
}: {
  notif: Notification;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const [open, setOpen] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const unreadBg = useColorModeValue("brand.50", "gray.750");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const unreadBorder = useColorModeValue("brand.100", "brand.900");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");
  const detailColor = useColorModeValue("gray.600", "gray.300");

  const meta = TYPE_META[notif.type];

  return (
    <Box
      bg={notif.isRead ? cardBg : unreadBg}
      border="1px solid"
      borderColor={notif.isRead ? borderColor : unreadBorder}
      borderRadius="2xl"
      overflow="hidden"
      transition="all 0.15s ease"
    >
      <HStack
        px={5}
        py={4}
        spacing={4}
        align="flex-start"
        cursor="pointer"
        onClick={() => { setOpen(!open); if (!notif.isRead) onMarkRead(notif.id); }}
        _hover={{ bg: useColorModeValue("gray.50", "gray.750") }}
      >
        {/* Icon */}
        <Box
          w="38px" h="38px" borderRadius="xl"
          bg={meta.bg}
          display="flex" alignItems="center" justifyContent="center"
          flexShrink={0}
          mt={0.5}
        >
          <Icon as={meta.icon} boxSize={4} color={meta.color} />
        </Box>

        {/* Content */}
        <Box flex={1} minW={0}>
          <HStack spacing={2} mb={0.5}>
            <Text fontWeight={notif.isRead ? "600" : "700"} fontSize="sm" color={headingColor} noOfLines={1}>
              {notif.title}
            </Text>
            {!notif.isRead && (
              <Box w="6px" h="6px" borderRadius="full" bg="brand.500" flexShrink={0} />
            )}
          </HStack>
          <Text fontSize="xs" color={mutedColor} noOfLines={open ? undefined : 1}>
            {notif.body}
          </Text>
          <Text fontSize="10px" color={mutedColor} mt={1}>{notif.timestamp}</Text>
        </Box>

        {/* Actions */}
        <HStack spacing={1} flexShrink={0} onClick={(e) => e.stopPropagation()}>
          {!notif.isRead && (
            <Tooltip label="Mark as read">
              <IconButton
                aria-label="Mark as read"
                icon={<FiCheck size={13} />}
                size="xs"
                borderRadius="full"
                variant="ghost"
                color={mutedColor}
                onClick={() => onMarkRead(notif.id)}
              />
            </Tooltip>
          )}
          <Tooltip label="Delete">
            <IconButton
              aria-label="Delete notification"
              icon={<FiTrash2 size={13} />}
              size="xs"
              borderRadius="full"
              variant="ghost"
              color="red.400"
              _hover={{ bg: "red.50", color: "red.500" }}
              onClick={() => onDelete(notif.id)}
            />
          </Tooltip>
          <Icon
            as={open ? FiChevronUp : FiChevronDown}
            boxSize={4}
            color={mutedColor}
            cursor="pointer"
          />
        </HStack>
      </HStack>

      {/* Expanded detail */}
      <Collapse in={open} animateOpacity>
        <Divider borderColor={borderColor} />
        <Box px={5} py={4}>
          <Text fontSize="sm" color={detailColor} lineHeight="1.7">
            {notif.detail}
          </Text>
        </Box>
      </Collapse>
    </Box>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(SEED);

  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const emptyBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markRead = (id: number) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const deleteNotif = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <Box>
      {/* Header */}
      <HStack justify="space-between" align="center" mb={5}>
        <HStack spacing={2}>
          <Text fontWeight="800" fontSize="lg" letterSpacing="-0.02em">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Badge colorScheme="purple" borderRadius="full" px={2} fontSize="xs">
              {unreadCount} new
            </Badge>
          )}
        </HStack>
        {unreadCount > 0 && (
          <Button
            size="xs"
            variant="ghost"
            leftIcon={<FiCheckCircle size={13} />}
            color={mutedColor}
            borderRadius="full"
            onClick={markAllRead}
          >
            Mark all read
          </Button>
        )}
      </HStack>

      {notifications.length === 0 ? (
        <Center
          flexDirection="column"
          gap={4}
          py={16}
          borderRadius="2xl"
          bg={emptyBg}
          border="1.5px dashed"
          borderColor={borderColor}
        >
          <Box
            w="56px" h="56px" borderRadius="full"
            bg="brand.50"
            display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={FiBell} boxSize={6} color="brand.500" />
          </Box>
          <VStack spacing={1}>
            <Text fontWeight="700" fontSize="lg" letterSpacing="-0.02em">All caught up</Text>
            <Text fontSize="sm" color={mutedColor} textAlign="center" maxW="260px">
              No notifications right now. We'll let you know when something's new.
            </Text>
          </VStack>
        </Center>
      ) : (
        <VStack spacing={3} align="stretch">
          {notifications.map((n) => (
            <NotifCard
              key={n.id}
              notif={n}
              onMarkRead={markRead}
              onDelete={deleteNotif}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default Notifications;
