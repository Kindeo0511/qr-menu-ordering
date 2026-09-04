import api from "../api/axios";

export async function LoadCategories(page, name) {
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (name) params.set("name", name);

  const query = params.toString() ? `?${params.toString()}` : "";

  try {
    const response = await api.get(`/api/categories/${query}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}
export async function GetAllFood(page, filter, search) {
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (filter) params.set("category", filter);
  if (search) params.set("search", search);
  const query = params.toString() ? `?${params.toString()}` : "";
  try {
    const response = await api.get(`/api/menu/${query}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function GetAllTable(page, search) {
  const param = new URLSearchParams();
  if (page) param.set("page", page);
  if (search) param.set("search", search);
  const query = param.toString() ? `?${param.toString()}` : "";
  try {
    const response = await api.get(`/api/table/${query}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
  }
}
export async function GetTableById(id) {
  try {
    const response = await api.get(`/api/qr-table/${id}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
  }
}
