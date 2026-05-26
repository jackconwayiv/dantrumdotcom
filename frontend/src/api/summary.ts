import axios from "axios";

export interface UrlSummary {
  title: string;
  thumbnail: string;
  summary: string;
}

export const fetchUrlSummary = async (url: string) => {
  try {
    const response = await axios.post<UrlSummary>("/api/summary/", { url });
    return response.data;
  } catch (error) {
    console.error("Error fetching URL summary:", error);
  }
};
