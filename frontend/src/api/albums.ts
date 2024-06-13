import axios from "axios";
import { Album } from "../helpers/types";

export const saveAlbum = async (albumDetails: Album) => {
  try {
    let response;
    if (albumDetails.id) {
      response = await axios.put(
        `/api/albums/${albumDetails.id}/`,
        albumDetails
      );
    } else {
      response = await axios.post("/api/albums/", albumDetails);
    }
    return response.data;
  } catch (error) {
    console.error("Error saving album:", error);
    throw error;
  }
};

export const deleteAlbum = async (albumId: number) => {
  try {
    const response = await axios.delete(`/api/albums/${albumId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting album:", error);
    throw error;
  }
};
