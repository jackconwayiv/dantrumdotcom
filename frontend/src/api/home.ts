import axios from "axios";
import { HomeRecentResponse } from "../helpers/types";

export const fetchHomeRecent = async () => {
  try {
    const response = await axios.get<HomeRecentResponse>("/api/home/recent/");
    return response.data;
  } catch (error) {
    console.error("Error fetching home recent items:", error);
  }
};
