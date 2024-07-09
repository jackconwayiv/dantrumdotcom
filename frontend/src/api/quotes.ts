import axios from "axios";
import { Quote } from "../helpers/types";

export const saveQuote = async (quoteDetails: Quote) => {
  try {
    let response;
    if (quoteDetails.id) {
      response = await axios.put(
        `/api/quotes/${quoteDetails.id}/`,
        quoteDetails
      );
    } else {
      response = await axios.post("/api/quotes/", quoteDetails);
    }
    return response.data;
  } catch (error) {
    console.error("Error saving quote:", error);
  }
};

export const deleteQuote = async (quoteId: number) => {
  try {
    const response = await axios.delete(`/api/quotes/${quoteId}/`);
    if (response.status === 204) return "success";
    return response.data;
  } catch (error) {
    console.error("Error deleting quote:", error);
  }
};
