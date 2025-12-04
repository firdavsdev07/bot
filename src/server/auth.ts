import axios from "axios";
import { showGlobalError } from "../utils/global-alert";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.craftly.uz/api/bot",
  withCredentials: true,
});

// Request interceptor: Tokenni qo'shamiz
authApi.interceptors.request.use((config) => {
  // Try both sessionStorage and localStorage (mock auth uses localStorage)
  const token = sessionStorage.getItem("accessToken") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 Bot: Token added to request");
  }
  return config;
});

// Response interceptor: Token muddati tugasa, qayta autentifikatsiya qilish
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 xatolik va retry qilinmagan bo'lsa
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;

      console.log("❌ Bot: Token expired, need to re-authenticate via Telegram");

      // ✅ FIX: Cheksiz refresh loop'ni oldini olish
      const retryCount = parseInt(sessionStorage.getItem("auth_retry_count") || "0");
      
      if (retryCount >= 3) {
        console.error("❌ Bot: Maximum retry attempts reached. Stopping refresh loop.");
        sessionStorage.removeItem("auth_retry_count");
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        
        // Show error message instead of reloading
        showGlobalError("Autentifikatsiya xatosi. Iltimos, bot'ni qaytadan oching.", "Xatolik");
        return Promise.reject(error);
      }

      sessionStorage.setItem("auth_retry_count", String(retryCount + 1));

      // Telegram bot uchun - foydalanuvchini qayta autentifikatsiya qilish kerak
      // Bu yerda initData orqali qayta login qilish mumkin
      const initData = window.Telegram?.WebApp?.initData;

      if (initData) {
        try {
          console.log("🔄 Bot: Re-authenticating with Telegram... (attempt " + (retryCount + 1) + "/3)");
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'https://api.craftly.uz/api/bot'}/auth/telegram`,
            { initData }
          );

          if (response.data.token) {
            console.log("✅ Bot: Re-authentication successful");
            sessionStorage.setItem("accessToken", response.data.token);
            sessionStorage.removeItem("auth_retry_count"); // Reset counter on success
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return await authApi.request(originalRequest);
          }
        } catch (reAuthError) {
          console.error("❌ Bot: Re-authentication failed:", reAuthError);
          sessionStorage.removeItem("accessToken");
          localStorage.removeItem("token");
          
          // ✅ FIX: Don't reload immediately, let retry counter handle it
          return Promise.reject(reAuthError);
        }
      } else {
        console.error("❌ Bot: No initData available for re-authentication");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("auth_retry_count");
        localStorage.removeItem("token");
        
        // Show error instead of reload
        showGlobalError("Telegram initData topilmadi. Iltimos, bot'ni qaytadan oching.", "Xatolik");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default authApi;
