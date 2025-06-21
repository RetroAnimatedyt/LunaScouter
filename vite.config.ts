import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    //allowedHosts: ["localhost", "2c4b-73-197-229-72.ngrok-free.app"],
    //allowedHosts: ["localhost", "aba6-73-197-229-72.ngrok-free.app"],
    allowedHosts: ["localhost", "2414-73-197-229-72.ngrok-free.app"],
  }
});
