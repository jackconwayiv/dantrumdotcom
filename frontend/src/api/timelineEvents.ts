import axios from "axios";
import { TimelineCustomEvent } from "../helpers/types";

export const fetchMyTimelineEvents = async () => {
  try {
    const response = await axios.get<TimelineCustomEvent[]>(
      "/api/timeline-events/mine/"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching my timeline events:", error);
  }
};

export const createTimelineEvent = async (event: TimelineCustomEvent) => {
  try {
    const response = await axios.post<TimelineCustomEvent>(
      "/api/timeline-events/",
      event
    );
    return response.data;
  } catch (error) {
    console.error("Error creating timeline event:", error);
  }
};

export const updateTimelineEvent = async (event: TimelineCustomEvent) => {
  try {
    const response = await axios.put<TimelineCustomEvent>(
      `/api/timeline-events/${event.id}/`,
      event
    );
    return response.data;
  } catch (error) {
    console.error("Error updating timeline event:", error);
  }
};

export const deleteTimelineEvent = async (eventId: number) => {
  try {
    await axios.delete(`/api/timeline-events/${eventId}/`);
    return true;
  } catch (error) {
    console.error("Error deleting timeline event:", error);
  }
};
