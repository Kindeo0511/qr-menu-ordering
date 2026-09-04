import axios, { isCancel, AxiosError } from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export async function CreateOrder(payload) {
  try {
    const response = await axios.post(
      `${API_URL}api/table/create-order/`,
      payload,
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function UpdateStatus(payload, id) {
  try {
    const response = await axios.patch(
      `${API_URL}api/table/update-order/${id}/`,
      payload,
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function ShowAllOrder() {
  try {
    const response = await axios.get(`${API_URL}api/table/all-order/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}
