import api from "../api/axios";

export async function AddUser(payload) {
  try {
    const response = await api.post(`/api/user/create/`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function UpdateUser(payload, pk) {
  try {
    const response = await api.put(`/api/user/update/${pk}/`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function DeleteUser(pk) {
  try {
    const response = await api.delete(`api/user/delete/${pk}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function GetAllUser(page, search, filter) {
  const param = new URLSearchParams();
  if (page) param.set("page", page);
  if (search) param.set("search", search);
  if (filter) param.set("role", filter);
  const query = param.toString() ? `?${param.toString()}` : "";
  try {
    const response = await api.get(`/api/user/all-user/${query}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
  }
}

export async function GetCurrentUser() {
  try {
    const response = await api.get(`api/user/me/`);
    return response.data;
  } catch (err) {
    if (error.response) {
      throw error.response.data;
    }
  }
}
