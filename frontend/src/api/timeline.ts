import axios from "axios";
import { TimelineMonthDetail, TimelineSummary } from "../helpers/types";

export const fetchTimelineSummary = async () => {
  try {
    const response = await axios.get<TimelineSummary>("/api/timeline/");
    return response.data;
  } catch (error) {
    console.error("Error fetching timeline summary:", error);
  }
};

export const fetchMonthEvents = async (year: number, month: number) => {
  try {
    const response = await axios.get<TimelineMonthDetail>(
      `/api/timeline/${year}/${month}/`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching timeline for ${year}-${month}:`, error);
  }
};

export const hideAlbumFromTimeline = async (albumId: number) => {
  try {
    await axios.post(`/api/timeline/albums/${albumId}/exclude/`);
    return true;
  } catch (error) {
    console.error(`Error hiding album ${albumId} from timeline:`, error);
  }
};

export const restoreAlbumToTimeline = async (albumId: number) => {
  try {
    await axios.delete(`/api/timeline/albums/${albumId}/exclude/`);
    return true;
  } catch (error) {
    console.error(`Error restoring album ${albumId} to timeline:`, error);
  }
};
