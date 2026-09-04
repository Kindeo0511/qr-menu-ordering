import api from "../api/axios";
const API_URL = import.meta.env.VITE_API_URL;

export async function GetAllFood(page, filter, search) {
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (filter) params.set("category", filter);
  if (search) params.set("search", search);
  const query = params.toString() ? `?${params.toString()}` : "";
  try {
    const response = await api.get(`/api/food-menu/all/${query}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function CreateFood(payload) {
  try {
    const response = await api.post(`/api/food-menu/create/`, payload);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    } else {
      throw { detail: "Something went wrong. Please try again." };
    }
  }
}

export async function UpdateFood(payload, id) {
  try {
    const response = await api.put(`/api/food-menu/update/${id}/`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function ChangeStatus(payload, id) {
  try {
    const response = await api.patch(`/api/food-menu/update/${id}/`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function DeleteFood(id) {
  try {
    const response = await api.delete(`/api/food-menu/delete/${id}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function GetFoodById(id) {
  try {
    const response = await api.get(`/api/food-menu/${id}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}
