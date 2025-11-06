import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/bot",
  withCredentials: true,
});

// Har bir so'rovga token qo'shamiz (sessiya davomida saqlangan)
authApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default authApi;
