import api from "../api/axios";
const API_URL = import.meta.env.VITE_API_URL;

export async function AddTable(payload) {
  try {
    const response = await api.post(`/api/table/create/`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function UpdateTable(payload, id) {
  try {
    const response = await api.patch(`/api/table/update/${id}/`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function DeleteTable(id) {
  try {
    const response = await api.delete(`/api/table/delete/${id}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
  }
}

export async function GetTableById(id) {
  try {
    const response = await api.get(`/api/table/${id}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
  }
}

export async function GetAllTable(page, search) {
  const param = new URLSearchParams();
  if (page) param.set("page", page);
  if (search) param.set("search", search);
  const query = param.toString() ? `?${param.toString()}` : "";
  try {
    const response = await api.get(`/api/table/all/${query}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
  }
}

export async function GenerateQRCode(id) {
  try {
    const response = await api.post(
      `/api/generate-qr-code/${id}/`,
      {}, // no request body needed
      { responseType: "blob" }, // ✅ tells axios to return raw binary data
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // error.response.data will ALSO be a blob (since responseType: 'blob'),
      // even though the server sent back JSON error details — need to parse it
      const errorText = await error.response.data.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw errorJson;
      } catch {
        throw new Error(errorText || "Failed to generate QR code.");
      }
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}
