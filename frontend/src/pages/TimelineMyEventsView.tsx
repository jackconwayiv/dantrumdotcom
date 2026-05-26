import {
  Box,
  Flex,
  Heading,
  Link,
  Select,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchMyAlbums } from "../api/albums";
import {
  createTimelineEvent,
  deleteTimelineEvent,
  fetchMyTimelineEvents,
  updateTimelineEvent,
} from "../api/timelineEvents";
import {
  hideAlbumFromTimeline,
  restoreAlbumToTimeline,
} from "../api/timeline";
import TimelineConfirmDialog from "../components/TimelineConfirmDialog";
import TimelineEventForm from "../components/TimelineEventForm";
import AppButton from "../components/ui/AppButton";
import PageHeading from "../components/ui/PageHeading";
import { Album, TimelineCustomEvent, User } from "../helpers/types";
import { renderAlbumDate } from "../helpers/utils";

interface TimelineMyEventsViewProps {
  user: User;
}

type FilterValue = "all" | number;

const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const parseDateParts = (isoDate: string) => ({
  year: dayjs(isoDate).year(),
  month: dayjs(isoDate).month() + 1,
});

const matchesYearMonth = (
  isoDate: string,
  year: FilterValue,
  month: FilterValue
) => {
  const parts = parseDateParts(isoDate);
  if (year !== "all" && parts.year !== year) return false;
  if (month !== "all" && parts.month !== month) return false;
  return true;
};

const compareByDateDesc = (a: string, b: string) =>
  dayjs(b).valueOf() - dayjs(a).valueOf();

const TimelineMyEventsView = ({ user }: TimelineMyEventsViewProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const displayUserLabel =
    user.email ||
    user.username ||
    `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
    "you";

  const [events, setEvents] = useState<TimelineCustomEvent[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterYear, setFilterYear] = useState<FilterValue>("all");
  const [filterMonth, setFilterMonth] = useState<FilterValue>("all");

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineCustomEvent | null>(
    null
  );
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const [eventToDelete, setEventToDelete] = useState<TimelineCustomEvent | null>(
    null
  );
  const [albumToRemove, setAlbumToRemove] = useState<Album | null>(null);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isRemoveOpen,
    onOpen: onRemoveOpen,
    onClose: onRemoveClose,
  } = useDisclosure();

  const loadData = useCallback(async () => {
    setLoading(true);
    const [eventData, albumData] = await Promise.all([
      fetchMyTimelineEvents(),
      fetchMyAlbums(),
    ]);
    setEvents(eventData ?? []);
    setAlbums(albumData ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    events.forEach((e) => years.add(parseDateParts(e.date).year));
    albums.forEach((a) => years.add(parseDateParts(a.date).year));
    return Array.from(years).sort((a, b) => b - a);
  }, [events, albums]);

  const availableMonths = useMemo(() => {
    if (filterYear === "all") return [];
    const months = new Set<number>();
    const addIfYear = (isoDate: string) => {
      const parts = parseDateParts(isoDate);
      if (parts.year === filterYear) months.add(parts.month);
    };
    events.forEach((e) => addIfYear(e.date));
    albums.forEach((a) => addIfYear(a.date));
    return Array.from(months).sort((a, b) => a - b);
  }, [events, albums, filterYear]);

  const filteredEvents = useMemo(
    () =>
      events
        .filter((e) => matchesYearMonth(e.date, filterYear, filterMonth))
        .sort((a, b) => compareByDateDesc(a.date, b.date)),
    [events, filterYear, filterMonth]
  );

  const filteredAlbums = useMemo(
    () =>
      albums
        .filter((a) => matchesYearMonth(a.date, filterYear, filterMonth))
        .sort((a, b) => compareByDateDesc(a.date, b.date)),
    [albums, filterYear, filterMonth]
  );

  const handleYearChange = (value: string) => {
    setFilterYear(value === "all" ? "all" : Number(value));
    setFilterMonth("all");
  };

  const openAddForm = () => {
    setEditingEvent(null);
    setFormTitle("");
    setFormDescription("");
    setFormDate(new Date().toISOString().split("T")[0]);
    setShowForm(true);
  };

  const openEditForm = (event: TimelineCustomEvent) => {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormDescription(event.description || "");
    setFormDate(event.date);
    setShowForm(true);
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
    const saved = editingEvent?.id
      ? await updateTimelineEvent({ ...payload, id: editingEvent.id })
      : await createTimelineEvent(payload);

    if (saved) {
      toast({
        title: editingEvent ? "Event updated" : "Event created",
        status: "success",
      });
      setShowForm(false);
      setEditingEvent(null);
      loadData();
    }
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete?.id) return;
    const deleted = await deleteTimelineEvent(eventToDelete.id);
    if (deleted) {
      toast({ title: "Event deleted", status: "success" });
      loadData();
    }
    setEventToDelete(null);
    onDeleteClose();
  };

  const confirmRemoveAlbum = async () => {
    if (!albumToRemove?.id) return;
    const ok = albumToRemove.timeline_excluded
      ? await restoreAlbumToTimeline(albumToRemove.id)
      : await hideAlbumFromTimeline(albumToRemove.id);
    if (ok) {
      toast({
        title: albumToRemove.timeline_excluded
          ? "Restored to timeline"
          : "Removed from timeline",
        status: "success",
      });
      loadData();
    }
    setAlbumToRemove(null);
    onRemoveClose();
  };

  const renderFilters = () => (
    <Flex
      gap={3}
      mb={6}
      wrap="wrap"
      align="flex-end"
      p={3}
      border="1px solid"
      borderColor="oasis.gray"
      borderRadius="lg"
      bg="oasis.surface"
      width="100%"
    >
      <Box>
        <Text fontSize="sm" fontWeight="bold" mb={1}>
          Year
        </Text>
        <Select
          width="140px"
          value={String(filterYear)}
          onChange={(e) => handleYearChange(e.target.value)}
        >
          <option value="all">All years</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </Box>
      <Box>
        <Text fontSize="sm" fontWeight="bold" mb={1}>
          Month
        </Text>
        <Select
          width="160px"
          value={String(filterMonth)}
          isDisabled={filterYear === "all"}
          onChange={(e) =>
            setFilterMonth(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
        >
          <option value="all">All months</option>
          {(filterYear === "all" ? [] : availableMonths).map((month) => (
            <option key={month} value={month}>
              {MONTH_OPTIONS[month - 1].label}
            </option>
          ))}
        </Select>
      </Box>
      {filterYear !== "all" || filterMonth !== "all" ? (
        <AppButton
          size="sm"
          colorTone="outline"
          onClick={() => {
            setFilterYear("all");
            setFilterMonth("all");
          }}
        >
          Clear filters
        </AppButton>
      ) : null}
    </Flex>
  );

  if (loading) {
    return (
      <Flex direction="column" p={2}>
        <PageHeading>MY TIMELINE EVENTS</PageHeading>
        <Text fontSize="xs" color="gray.600">
          Managing for {displayUserLabel}
        </Text>
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" p={2} width="100%">
      <PageHeading>MY TIMELINE EVENTS</PageHeading>
      <Text fontSize="xs" color="gray.600" mb={3}>
        Managing for {displayUserLabel}
      </Text>
      <AppButton
        colorTone="soft"
        size="sm"
        alignSelf="flex-start"
        mb={4}
        onClick={() => navigate("/app/timeline")}
      >
        Back to timeline
      </AppButton>

      {renderFilters()}

      <Heading size="md" color="brand.600" mb={2}>
        Custom events
        {filterYear !== "all" ? ` · ${filterYear}` : ""}
        {filterMonth !== "all"
          ? ` · ${MONTH_OPTIONS[filterMonth - 1].label}`
          : ""}
      </Heading>
      <AppButton
        leftIcon={<FaPlus />}
        colorTone="success"
        size="sm"
        alignSelf="flex-start"
        mb={3}
        onClick={openAddForm}
      >
        New event
      </AppButton>

      {showForm && (
        <TimelineEventForm
          title={formTitle}
          date={formDate}
          description={formDescription}
          isEditing={!!editingEvent}
          onTitleChange={setFormTitle}
          onDateChange={setFormDate}
          onDescriptionChange={setFormDescription}
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
        />
      )}

      {filteredEvents.length === 0 && !showForm ? (
        <Text mb={6} color="gray.600">
          {events.length === 0
            ? "No custom events yet."
            : "No custom events match this year and month."}
        </Text>
      ) : (
        <Flex direction="column" gap={2} mb={8}>
          {filteredEvents.map((event) => (
            <Box
              key={event.id}
              p={3}
              border="1px solid"
              borderColor="oasis.gray"
              borderRadius="lg"
            >
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Text fontWeight="bold">{event.title}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {dayjs(event.date).format("MMMM D, YYYY")}
                  </Text>
                  {event.description ? (
                    <Text fontSize="sm" mt={1}>
                      {event.description}
                    </Text>
                  ) : null}
                </Box>
                <Flex gap={1}>
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
                      setEventToDelete(event);
                      onDeleteOpen();
                    }}
                  >
                    Delete
                  </AppButton>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Flex>
      )}

      <Heading size="md" color="brand.600" mb={2}>
        My albums on the timeline
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={3}>
        Albums appear on the timeline automatically when you post them. Remove
        only hides them from the grid; they stay in Photos.
      </Text>

      {filteredAlbums.length === 0 ? (
        <Text color="gray.600">
          {albums.length === 0
            ? "No albums yet."
            : "No albums match this year and month."}
        </Text>
      ) : (
        <Flex direction="column" gap={2}>
          {filteredAlbums.map((album) => (
            <Box
              key={album.id}
              p={3}
              border="1px solid"
              borderColor="oasis.gray"
              borderRadius="lg"
              opacity={album.timeline_excluded ? 0.7 : 1}
            >
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Link href={album.link_url} isExternal fontWeight="bold">
                    {album.title}
                  </Link>
                  <Text fontSize="sm" color="gray.600">
                    Timeline month: {renderAlbumDate(album.date)}
                  </Text>
                  {album.timeline_excluded ? (
                    <Text fontSize="xs" color="oasis.orange.600" mt={1}>
                      Hidden from timeline
                    </Text>
                  ) : null}
                </Box>
                <AppButton
                  size="xs"
                  colorTone={album.timeline_excluded ? "success" : "cta"}
                  onClick={() => {
                    setAlbumToRemove(album);
                    onRemoveOpen();
                  }}
                >
                  {album.timeline_excluded ? "Restore" : "Remove"}
                </AppButton>
              </Flex>
            </Box>
          ))}
        </Flex>
      )}

      <TimelineConfirmDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        leastDestructiveRef={cancelRef}
        title="Delete event"
        body={`Delete "${eventToDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteEvent}
      />

      <TimelineConfirmDialog
        isOpen={isRemoveOpen}
        onClose={onRemoveClose}
        leastDestructiveRef={cancelRef}
        title={
          albumToRemove?.timeline_excluded
            ? "Restore to timeline"
            : "Remove from timeline"
        }
        body={
          albumToRemove?.timeline_excluded
            ? `Show "${albumToRemove?.title}" on the timeline again?`
            : `Are you sure you want to remove "${albumToRemove?.title}" from the timeline? The photo album will still be available in Photos.`
        }
        confirmLabel={
          albumToRemove?.timeline_excluded ? "Restore" : "Remove"
        }
        confirmColorScheme={
          albumToRemove?.timeline_excluded ? "green" : "orange"
        }
        onConfirm={confirmRemoveAlbum}
      />
    </Flex>
  );
};

export default TimelineMyEventsView;
