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
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import {
  FiBell,
  FiTrash2,
  FiCheck,
  FiCheckCircle,
  FiCalendar,
  FiHeart,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle,
} from "react-icons/fi";
import { Notification } from "../types/event";
import { apiService } from "../services/api";
import { formatDistanceToNow, parseISO } from "date-fns";

type NotifMeta = { icon: React.ElementType; color: string; bg: string };

const TYPE_META: Record<string, NotifMeta> = {
  reminder:        { icon: FiCalendar,     color: "brand.500",  bg: "brand.50"  },
  event_approved:  { icon: FiCheckCircle,  color: "green.500",  bg: "green.50"  },
  event_rejected:  { icon: FiAlertCircle,  color: "red.400",    bg: "red.50"    },
  new_event_nearby:{ icon: FiInfo,         color: "blue.500",   bg: "blue.50"   },
  rsvp_confirmed:  { icon: FiHeart,        color: "brand.500",  bg: "brand.50"  },
  event_cancelled: { icon: FiBell,         color: "orange.500", bg: "orange.50" },
};

const FALLBACK_META: NotifMeta = { icon: FiBell, color: "gray.500", bg: "gray.100" };

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

  const cardBg       = useColorModeValue("white",      "gray.800");
  const unreadBg     = useColorModeValue("brand.50",   "gray.750");
  const borderColor  = useColorModeValue("gray.200",   "gray.700");
  const unreadBorder = useColorModeValue("brand.100",  "brand.900");
  const mutedColor   = useColorModeValue("gray.500",   "gray.400");
  const headingColor = useColorModeValue("gray.800",   "white");
  const detailColor  = useColorModeValue("gray.600",   "gray.300");
  const hoverBg      = useColorModeValue("gray.50",    "gray.750");

  const meta = TYPE_META[notif.type] ?? FALLBACK_META;

  const timeAgo = (() => {
    try { return formatDistanceToNow(parseISO(notif.created_at), { addSuffix: true }); }
    catch { return ""; }
  })();

  return (
    <Box
      bg={notif.is_read ? cardBg : unreadBg}
      border="1px solid"
      borderColor={notif.is_read ? borderColor : unreadBorder}
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
        onClick={() => { setOpen(!open); if (!notif.is_read) onMarkRead(notif.id); }}
        _hover={{ bg: hoverBg }}
      >
        <Box
          w="38px" h="38px" borderRadius="xl"
          bg={meta.bg}
          display="flex" alignItems="center" justifyContent="center"
          flexShrink={0} mt={0.5}
        >
          <Icon as={meta.icon} boxSize={4} color={meta.color} />
        </Box>

        <Box flex={1} minW={0}>
          <HStack spacing={2} mb={0.5}>
            <Text fontWeight={notif.is_read ? "600" : "700"} fontSize="sm" color={headingColor} noOfLines={1}>
              {notif.title}
            </Text>
            {!notif.is_read && (
              <Box w="6px" h="6px" borderRadius="full" bg="brand.500" flexShrink={0} />
            )}
          </HStack>
          <Text fontSize="xs" color={mutedColor} noOfLines={open ? undefined : 1}>
            {notif.body}
          </Text>
          <Text fontSize="10px" color={mutedColor} mt={1}>{timeAgo}</Text>
        </Box>

        <HStack spacing={1} flexShrink={0} onClick={(e) => e.stopPropagation()}>
          {!notif.is_read && (
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
          <Icon as={open ? FiChevronUp : FiChevronDown} boxSize={4} color={mutedColor} cursor="pointer" />
        </HStack>
      </HStack>

      <Collapse in={open} animateOpacity>
        <Divider borderColor={borderColor} />
        <Box px={5} py={4}>
          <Text fontSize="sm" color={detailColor} lineHeight="1.7">
            {notif.detail || notif.body}
          </Text>
          {notif.event && (
            <Text fontSize="xs" color={mutedColor} mt={2} fontWeight="600">
              Event: {notif.event.title}
            </Text>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [markingAll, setMarkingAll]       = useState(false);

  const mutedColor  = useColorModeValue("gray.500", "gray.400");
  const emptyBg     = useColorModeValue("gray.50",  "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await apiService.getNotifications();
      setNotifications(data.results);
    } catch {
      // silently fail — non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markRead = async (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try { await apiService.markNotificationRead(id); } catch {}
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try { await apiService.markAllNotificationsRead(); } catch {}
    setMarkingAll(false);
  };

  const deleteNotif = async (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try { await apiService.deleteNotification(id); } catch {}
  };

  return (
    <Box>
      {/* Header */}
      <HStack justify="space-between" align="center" mb={5}>
        <HStack spacing={2}>
          <Text fontWeight="800" fontSize="lg" letterSpacing="-0.02em">Notifications</Text>
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
            isLoading={markingAll}
          >
            Mark all read
          </Button>
        )}
      </HStack>

      {loading ? (
        <Center py={16}>
          <VStack spacing={3}>
            <Spinner size="md" color="brand.500" thickness="3px" speed="0.7s" />
            <Text fontSize="sm" color={mutedColor}>Loading notifications…</Text>
          </VStack>
        </Center>
      ) : notifications.length === 0 ? (
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
            w="56px" h="56px" borderRadius="full" bg="brand.50"
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
            <NotifCard key={n.id} notif={n} onMarkRead={markRead} onDelete={deleteNotif} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default Notifications;
