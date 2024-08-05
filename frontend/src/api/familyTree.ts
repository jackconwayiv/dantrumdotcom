import axios from "axios";
import {
  AddMemberData,
  FamilyTreeMember,
  FamilyTreeRelation,
} from "../helpers/types";

export const addMember = async (
  data: AddMemberData
): Promise<FamilyTreeMember> => {
  try {
    const response = await axios.post<FamilyTreeMember>(
      "/api/family-tree/add-member/",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error adding a member to your family tree:", error);
    throw error;
  }
};

export const createSelf = async (): Promise<FamilyTreeMember> => {
  try {
    const response = await axios.post<FamilyTreeMember>(
      "/api/family-tree/create-self/"
    );
    return response.data;
  } catch (error) {
    console.error("Error creating a family tree member for yourself:", error);
    throw error;
  }
};

export const getRelationsById = async (
  userId: number
): Promise<FamilyTreeRelation[]> => {
  try {
    const response = await axios.get<FamilyTreeRelation[]>(
      `/api/family-tree/get-relations-by-id/?user_id=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching family relations:", error);
    throw error;
  }
};

export const getFamilyMembers = async (): Promise<FamilyTreeMember[]> => {
  try {
    const response = await axios.get<FamilyTreeMember[]>("/api/family-tree/");
    return response.data;
  } catch (error) {
    console.error("Error fetching family members:", error);
    throw error;
  }
};

export const getFamilyMembersByOwner = async (
  ownerId: number
): Promise<FamilyTreeMember[]> => {
  try {
    const response = await axios.get<FamilyTreeMember[]>(
      `/api/family-tree/by-owner/${ownerId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching family members:", error);
    throw error;
  }
};

export const deleteFamilyMember = async (id: number): Promise<void> => {
  try {
    await axios.delete(`/api/family-tree/${id}/`);
  } catch (error) {
    console.error("Error deleting family member:", error);
    throw error;
  }
};

export const editFamilyMember = async (
  id: number,
  data: AddMemberData
): Promise<FamilyTreeMember> => {
  try {
    const response = await axios.put<FamilyTreeMember>(
      `/api/family-tree/${id}/`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error editing the family member:", error);
    throw error;
  }
};
