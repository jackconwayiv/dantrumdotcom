import { Flex, Text, useToast } from "@chakra-ui/react";
import PageHeading from "../components/ui/PageHeading";
import AppButton from "../components/ui/AppButton";
import { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchMonthEvents, fetchTimelineSummary } from "../api/timeline";
import { createTimelineEvent } from "../api/timelineEvents";
import MonthDetailModal from "../components/MonthDetailModal";
import TimelineEventForm from "../components/TimelineEventForm";
import TimelineGrid from "../components/TimelineGrid";
import {
  TimelineCustomEvent,
  TimelineMonthEvent,
  TimelineYearSummary,
  User,
} from "../helpers/types";

interface TimelineViewProps {
  user: User;
}

const TimelineView = ({ user }: TimelineViewProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [years, setYears] = useState<TimelineYearSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [monthName, setMonthName] = useState("");
  const [monthEvents, setMonthEvents] = useState<TimelineMonthEvent[]>([]);
  const [monthLoading, setMonthLoading] = useState(false);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    const data = await fetchTimelineSummary();
    if (data) {
      setYears(data.years);
    } else {
      setError("Couldn't load timeline");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const loadMonth = useCallback(async (year: number, month: number) => {
    setMonthLoading(true);
    const data = await fetchMonthEvents(year, month);
    if (data) {
      setMonthName(data.month_name);
      setMonthEvents(data.events);
    }
    setMonthLoading(false);
  }, []);

  const handleMonthClick = async (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setModalOpen(true);
    await loadMonth(year, month);
  };

  const handleModalRefresh = async () => {
    if (selectedYear !== null && selectedMonth !== null) {
      await loadMonth(selectedYear, selectedMonth);
    }
    await loadSummary();
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedYear(null);
    setSelectedMonth(null);
    setMonthEvents([]);
  };

  const openAddForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormDate(new Date().toISOString().split("T")[0]);
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
    const saved = await createTimelineEvent(payload);
    if (saved) {
      toast({ title: "Event created", status: "success" });
      setShowAddForm(false);
      setFormTitle("");
      setFormDescription("");
      setFormDate("");
      await loadSummary();
    }
  };

  if (loading) {
    return (
      <Flex direction="column" p={2}>
        <PageHeading>TIMELINE</PageHeading>
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" p={2}>
        <PageHeading>TIMELINE</PageHeading>
        <Text>{error}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" p={2} width="100%">
      <PageHeading>TIMELINE</PageHeading>
      <Flex gap={2} mb={3} wrap="wrap">
        <AppButton
          leftIcon={<FaPlus />}
          colorTone="success"
          size="sm"
          onClick={openAddForm}
        >
          New event
        </AppButton>
        <AppButton
          colorTone="soft"
          size="sm"
          onClick={() => navigate("/app/timeline/my-events")}
        >
          Manage my events
        </AppButton>
      </Flex>

      {showAddForm ? (
        <Flex direction="column" mb={4} width="100%">
          <TimelineEventForm
            title={formTitle}
            date={formDate}
            description={formDescription}
            isEditing={false}
            onTitleChange={setFormTitle}
            onDateChange={setFormDate}
            onDescriptionChange={setFormDescription}
            onCancel={() => setShowAddForm(false)}
            onSave={handleSaveEvent}
          />
        </Flex>
      ) : null}

      {years.length === 0 ? (
        <Text>No timeline events yet. Add a photo album or custom event.</Text>
      ) : (
        <TimelineGrid years={years} onMonthClick={handleMonthClick} />
      )}

      <MonthDetailModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        year={selectedYear}
        month={selectedMonth}
        monthName={monthName}
        events={monthEvents}
        loading={monthLoading}
        user={user}
        onRefresh={handleModalRefresh}
      />
    </Flex>
  );
};

export default TimelineView;
