export function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatPrice(price) {
  if (price == null) return "₱0.00";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
}

// src/utils/errors.js
export function extractErrorMessage(err) {
  const data = err?.response?.data ?? err;

  if (typeof data === "string") return data;
  if (data?.detail) return data.detail;

  if (data && typeof data === "object") {
    const firstKey = Object.keys(data)[0];
    const firstVal = data[firstKey];
    if (Array.isArray(firstVal)) return firstVal[0];
    if (typeof firstVal === "string") return firstVal;
  }

  return err?.message || "Something went wrong.";
}
