import axios from "axios";
import { DjangoPaginatedResponse, Friend, User } from "../helpers/types";

export const fetchUserProfile = async () => {
  const response = await axios.get<User>(`/api/users/me/`);
  return response.data;
};

export const fetchFriends = async () => {
  const response = await axios.get<DjangoPaginatedResponse<Friend>>(
    `/api/users/`
  );
  return response.data;
};

export const fetchUserById = async (id: string) => {
  const response = await axios.get<Friend>(`/api/users/${id}/`);
  return response.data;
};

export const updateUser = async (formData: User) => {
  try {
    const response = await axios.patch("/api/users/me/", formData);
    return response.data;
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    throw error;
  }
};
