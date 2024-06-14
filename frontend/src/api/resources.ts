import axios from "axios";
import { Resource } from "../helpers/types";

export const saveResource = async (resourceDetails: Resource) => {
  try {
    let response;
    if (resourceDetails.id) {
      response = await axios.put(
        `/api/resources/${resourceDetails.id}/`,
        resourceDetails
      );
    } else {
      response = await axios.post("/api/resources/", resourceDetails);
    }
    return response.data;
  } catch (error) {
    console.error("Error saving resource:", error);
    throw error;
  }
};

export const deleteResource = async (resourceId: number) => {
  try {
    const response = await axios.delete(`/api/resources/${resourceId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw error;
  }
};