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

  /**
   * Base Path Configuration
   *
   * Set to "/" to deploy the application at the root level.
   *
   * Why base: "/" instead of base: "/bot/"?
   * - The application is deployed as a standalone SPA at the root of the domain
   * - Using "/" ensures assets are generated with root-relative paths (e.g., /assets/index-[hash].js)
   * - This prevents MIME type errors in production where the server might return HTML
   *   instead of JavaScript when using a base path like "/bot/"
   * - Vercel automatically serves static files correctly when deployed at root
   *
   * Important: Do not change this to a subdirectory path (e.g., "/bot/") unless you also
   * update the Vercel routing configuration to properly handle static asset requests
   * before applying SPA rewrites.
   */
  base: "/",

  optimizeDeps: {
    include: ["swiper"],
  },
  server: {
    host: true,
    port: 5174,
    allowedHosts: [
      ".ngrok-free.app",
      ".trycloudflare.com",
      ".loca.lt",
      "localhost",
    ],
  },
});
