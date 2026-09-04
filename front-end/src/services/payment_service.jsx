import api from "../api/axios";
const API_URL = import.meta.env.VITE_API_URL;

export async function SavePayment(payload) {
  try {
    const response = await api.post(`/api/payment/process-payment/`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function ShowAllPaymentRecords(
  page,
  search,
  filter,
  dateFrom,
  dateTo,
) {
  const param = new URLSearchParams();
  if (page) param.set("page", page);
  if (filter && filter !== "all") {
    param.set("table_order__payment_status", filter);
  }
  if (search) param.set("search", search);
  if (dateFrom) param.set("created_at__gte", dateFrom);
  if (dateTo) param.set("created_at__lte", dateTo);

  const query = param.toString() ? `?${param.toString()}` : "";
  try {
    const response = await api.get(`/api/payment/all-payment/${query}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function GetPaymentRecordById(id) {
  try {
    const response = await api.get(`/api/payment/${id}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
}
