import axios from "axios";
import { DjangoPaginatedResponse, FriendType } from "../helpers/types";

export const fetchUserProfile = async () => {
  const response = await axios.get(`/api/users/me/`);
  return response.data;
};

export const fetchFriends = async () => {
  const response = await axios.get<DjangoPaginatedResponse<FriendType>>(
    `/api/users/`
  );
  return response.data;
};

export const fetchUserById = async (id: string) => {
  const response = await axios.get<FriendType>(`/api/users/${id}/`);
  return response.data;
};
