import api from "@/api";
import type { ProfileResponse } from "@/types";

export async function getProfile() {
  try {
    const response = await api.get<ProfileResponse>("/profile");
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
