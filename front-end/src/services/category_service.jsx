import api from "../api/axios";
const API_URL = import.meta.env.VITE_API_URL;

export async function CreateCategory(payload) {
  try {
    const response = await api.post(`/api/category-menu/create/`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function LoadCategories(page, name) {
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (name) params.set("name", name);

  const query = params.toString() ? `?${params.toString()}` : "";

  try {
    const response = await api.get(`/api/category-menu/all/${query}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function GetCategory(id) {
  try {
    const response = await api.get(`/api/category-menu/${id}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function UpdateCategory(payload, id) {
  try {
    const response = await api.put(`/api/category-menu/update/${id}/`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function DeleteCategory(id) {
  try {
    const response = await api.delete(`/api/category-menu/delete/${id}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}
