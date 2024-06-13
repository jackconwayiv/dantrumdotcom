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
    throw error;
  }
};

export const deleteQuote = async (quoteId: number) => {
  try {
    const response = await axios.delete(`/api/quotes/${quoteId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting quote:", error);
    throw error;
  }
};