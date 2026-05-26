import axios from "axios";
import { User } from "../helpers/types";

export const fetchUpcomingBirthdays = async () => {
  try {
    const response = await axios.get<User[]>("/api/birthdays/");
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming birthdays:", error);
  }
};
