import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://api.craftly.uz/api/bot";

const paymentApi = axios.create({
  baseURL: `${API_URL}/payment`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token'ni har bir request'ga qo'shish
paymentApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface SetReminderPayload {
  contractId: string;
  targetMonth: number;
  reminderDate: string; // ISO format: "2024-12-25"
  reminderComment?: string; // Ixtiyoriy izoh
}

export interface RemoveReminderPayload {
  contractId: string;
  targetMonth: number;
}

/**
 * To'lov uchun eslatma sanasini belgilash
 */
export const setPaymentReminder = async (payload: SetReminderPayload) => {
  const response = await paymentApi.post("/set-reminder", payload);
  return response.data;
};

/**
 * To'lov eslatmasini o'chirish
 */
export const removePaymentReminder = async (payload: RemoveReminderPayload) => {
  const response = await paymentApi.post("/remove-reminder", payload);
  return response.data;
};

export default paymentApi;
