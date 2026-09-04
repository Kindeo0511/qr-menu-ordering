import axios, { isCancel, AxiosError } from "axios";
import api from "../api/axios";

export async function ShowDashBoardStats() {
  try {
    const response = await api.get(`api/dashboard/stats/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}
