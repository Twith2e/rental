import api from "@/api";
import { Furniture } from "@/types";

export async function getAllFurnitures() {
  try {
    const response = await api.get<Furniture[]>("/furniture");
    return response.data;
  } catch (error) {
    throw error;
  }
}
