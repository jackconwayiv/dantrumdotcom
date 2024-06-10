import axios from "axios";

export const fetchUserProfile = async () => {
  const response = await axios.get(`api/users/me/`, { withCredentials: true });
  return response.data;
};
