import {
  Box,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { hideAlbumFromTimeline } from "../api/timeline";
import {
  createTimelineEvent,
  deleteTimelineEvent,
  updateTimelineEvent,
} from "../api/timelineEvents";
import { TimelineCustomEvent, TimelineMonthEvent, User } from "../helpers/types";
import dayjs from "dayjs";
import { isOwner, renderFirstLastName, renderSharedBy } from "../helpers/utils";
import TimelineConfirmDialog from "./TimelineConfirmDialog";
import TimelineEventForm from "./TimelineEventForm";
import AppButton from "./ui/AppButton";

interface MonthDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number | null;
  month: number | null;
  monthName: string;
  events: TimelineMonthEvent[];
  loading: boolean;
  user: User;
  onRefresh: () => void;
}

const MonthDetailModal = ({
  isOpen,
  onClose,
  year,
  month,
  monthName,
  events,
  loading,
  user,
  onRefresh,
}: MonthDetailModalProps) => {
  const toast = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineMonthEvent | null>(
    null
  );
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [eventToRemove, setEventToRemove] = useState<TimelineMonthEvent | null>(
    null
  );
  const [albumToHide, setAlbumToHide] = useState<TimelineMonthEvent | null>(
    null
  );
  const cancelRef = useRef<HTMLButtonElement>(null);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isHideOpen,
    onOpen: onHideOpen,
    onClose: onHideClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isOpen) {
      setShowAddForm(false);
      setEditingEvent(null);
      setFormTitle("");
      setFormDate("");
      setFormDescription("");
    }
  }, [isOpen]);

  const defaultFormDate = () => {
    if (!year || !month) return "";
    const today = new Date();
    if (today.getFullYear() === year && today.getMonth() + 1 === month) {
      return today.toISOString().split("T")[0];
    }
    return `${year}-${String(month).padStart(2, "0")}-01`;
  };

  const openAddForm = () => {
    setEditingEvent(null);
    setFormTitle("");
    setFormDescription("");
    setFormDate(defaultFormDate());
    setShowAddForm(true);
  };

  const openEditForm = (event: TimelineMonthEvent) => {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormDescription(event.description || "");
    setFormDate(event.date || defaultFormDate());
    setShowAddForm(true);
  };

  const handleSaveEvent = async () => {
    if (!formTitle || !formDate) {
      toast({ title: "Title and date are required", status: "warning" });
      return;
    }

    const payload: TimelineCustomEvent = {
      title: formTitle,
      date: formDate,
      description: formDescription,
    };

    let saved;
    if (editingEvent) {
      const eventId = Number(editingEvent.id.replace("event-", ""));
      saved = await updateTimelineEvent({ ...payload, id: eventId });
    } else {
      saved = await createTimelineEvent(payload);
    }

    if (saved) {
      toast({
        title: editingEvent ? "Event updated" : "Event created",
        status: "success",
      });
      setShowAddForm(false);
      setEditingEvent(null);
      onRefresh();
    }
  };

  const confirmDeleteEvent = async () => {
    if (!eventToRemove) return;
    const eventId = Number(eventToRemove.id.replace("event-", ""));
    const deleted = await deleteTimelineEvent(eventId);
    if (deleted) {
      toast({ title: "Event deleted", status: "success" });
      onRefresh();
    }
    setEventToRemove(null);
    onDeleteClose();
  };

  const confirmHideAlbum = async () => {
    if (!albumToHide) return;
    const albumId = Number(albumToHide.id.replace("album-", ""));
    const hidden = await hideAlbumFromTimeline(albumId);
    if (hidden) {
      toast({ title: "Removed from timeline", status: "success" });
      onRefresh();
    }
    setAlbumToHide(null);
    onHideClose();
  };

  const birthdays = events.filter((event) => event.type === "birthday");
  const monthEvents = events.filter((event) => event.type !== "birthday");

  const birthdayDayLabel = (event: TimelineMonthEvent) => {
    if (event.owner.date_of_birth) {
      return dayjs(event.owner.date_of_birth).format("D");
    }
    if (event.sort_date) {
      return dayjs(event.sort_date).format("D");
    }
    return null;
  };

  const renderEventRow = (event: TimelineMonthEvent) => {
    return (
      <Flex
        key={event.id}
        direction="column"
        p={2}
        mb={2}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
      >
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Box>
            {event.type === "album" && event.link_url ? (
              <Link href={event.link_url} isExternal fontWeight="bold">
                {event.title}
              </Link>
            ) : (
              <Text fontWeight="bold">{event.title}</Text>
            )}
            {event.date && (
              <Text fontSize="xs" color="gray.600">
                {event.date}
              </Text>
            )}
            {event.description && (
              <Text fontSize="sm" mt={1}>
                {event.description}
              </Text>
            )}
          </Box>
          <Flex gap={1}>
            {event.type === "event" && isOwner(user, event) && (
              <>
                <AppButton
                  size="xs"
                  colorTone="soft"
                  onClick={() => openEditForm(event)}
                >
                  Edit
                </AppButton>
                <AppButton
                  size="xs"
                  colorTone="outline"
                  onClick={() => {
                    setEventToRemove(event);
                    onDeleteOpen();
                  }}
                >
                  <FaRegTrashAlt />
                </AppButton>
              </>
            )}
            {event.can_remove_from_timeline && (
              <AppButton
                size="xs"
                colorTone="cta"
                onClick={() => {
                  setAlbumToHide(event);
                  onHideOpen();
                }}
              >
                Remove
              </AppButton>
            )}
          </Flex>
        </Flex>
        {event.owner && renderSharedBy(event.owner, { align: "end" })}
      </Flex>
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {monthName} {year}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <Flex justifyContent="center" p={4}>
                <Spinner />
              </Flex>
            ) : events.length === 0 ? (
              <Text>No events this month.</Text>
            ) : (
              <>
                {birthdays.length > 0 && (
                  <Box as="section" mb={4}>
                    <Text fontWeight="semibold" fontSize="sm" mb={2}>
                      {monthName} Birthdays:
                    </Text>
                    <Box as="ul" pl={5} m={0} style={{ listStyleType: "disc" }}>
                      {birthdays.map((event) => {
                        const dayLabel = birthdayDayLabel(event);
                        const name = renderFirstLastName(event.owner);
                        return (
                          <Box as="li" key={event.id} fontSize="sm" mb={1}>
                            {dayLabel != null ? `${dayLabel}: ${name}` : name}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
                {monthEvents.map(renderEventRow)}
              </>
            )}

            {showAddForm && (
              <TimelineEventForm
                title={formTitle}
                date={formDate}
                description={formDescription}
                isEditing={!!editingEvent}
                onTitleChange={setFormTitle}
                onDateChange={setFormDate}
                onDescriptionChange={setFormDescription}
                onCancel={() => setShowAddForm(false)}
                onSave={handleSaveEvent}
              />
            )}
          </ModalBody>
          <ModalFooter>
            {!showAddForm && (
              <AppButton colorTone="success" onClick={openAddForm}>
                Add event
              </AppButton>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TimelineConfirmDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        leastDestructiveRef={cancelRef}
        title="Delete event"
        body={`Delete "${eventToRemove?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteEvent}
      />

      <TimelineConfirmDialog
        isOpen={isHideOpen}
        onClose={onHideClose}
        leastDestructiveRef={cancelRef}
        title="Remove from timeline"
        body={`Are you sure you want to remove "${albumToHide?.title}" from the timeline? The photo album will still be available in Photos.`}
        confirmLabel="Remove"
        confirmColorScheme="orange"
        onConfirm={confirmHideAlbum}
      />
    </>
  );
};

export default MonthDetailModal;
