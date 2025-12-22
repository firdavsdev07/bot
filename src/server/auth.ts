import axios from "axios";
import { showGlobalError } from "../utils/global-alert";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.craftly.uz/api/bot",
  withCredentials: true,
});

authApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;


      const retryCount = parseInt(sessionStorage.getItem("auth_retry_count") || "0");
      
      if (retryCount >= 3) {
        sessionStorage.removeItem("auth_retry_count");
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        showGlobalError("Autentifikatsiya xatosi. Iltimos, bot'ni qaytadan oching.", "Xatolik");
        return Promise.reject(error);
      }

      sessionStorage.setItem("auth_retry_count", String(retryCount + 1));

      const initData = window.Telegram?.WebApp?.initData;

      if (initData) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'https://api.craftly.uz/api/bot'}/auth/telegram`,
            { initData }
          );

          if (response.data.token) {
            sessionStorage.setItem("accessToken", response.data.token);
            sessionStorage.removeItem("auth_retry_count"); // Reset counter on success
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return await authApi.request(originalRequest);
          }
        } catch (reAuthError) {
          sessionStorage.removeItem("accessToken");
          localStorage.removeItem("token");
          
          return Promise.reject(reAuthError);
        }
      } else {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("auth_retry_count");
        localStorage.removeItem("token");
        
        showGlobalError("Telegram initData topilmadi. Iltimos, bot'ni qaytadan oching.", "Xatolik");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default authApi;
