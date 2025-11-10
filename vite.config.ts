// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     include: ["swiper"],
//   },
//   server: {
//     host: true,
//     port: 5174,
//     allowedHosts: [".ngrok-free.app"],
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: "/bot/", // ❌ NOTO'G'RI - Vercel'da muammo
  base: "/", // ✅ TO'G'RI - Vercel uchun
  optimizeDeps: {
    include: ["swiper"],
  },
  server: {
    host: true,
    port: 5174,
    allowedHosts: [".ngrok-free.app", ".ngrok-free.dev"],
  },
});