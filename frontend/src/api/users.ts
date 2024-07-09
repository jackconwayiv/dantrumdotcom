import axios from "axios";
import { DjangoPaginatedResponse, Friend, User } from "../helpers/types";

export const fetchUserProfile = async () => {
  try {
    const response = await axios.get<User>(`/api/users/me/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const fetchFriends = async () => {
  try {
    const response = await axios.get<DjangoPaginatedResponse<Friend>>(
      `/api/users/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};

export const fetchUserById = async (id: string) => {
  try {
    const response = await axios.get<Friend>(`/api/users/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user by id (${id}):`, error);
    throw error;
  }
};

export const updateUser = async (formData: User) => {
  try {
    const response = await axios.patch("/api/users/me/", formData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
