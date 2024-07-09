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
  }
};

export const deleteAlbum = async (albumId: number) => {
  try {
    const response = await axios.delete(`/api/albums/${albumId}/`);
    if (response.status === 204) return "success";
    return response.data;
  } catch (error) {
    console.error("Error deleting album:", error);
  }
};

interface AlbumData {
  date: string;
  title: string;
  link_url: string;
  thumbnail_url: string;
}

export async function fetchAlbumDataFromBackend(
  url: string
): Promise<AlbumData | null> {
  try {
    const response = await axios.post("/api/fetch-album-data/", { url });
    return response.data;
  } catch (error) {
    console.error("Error fetching album data:", error);
    return null;
  }
}
