import path from "https://vite.dev/config"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "veet"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
// vite.config.js
export default {
  server: {
    host: 'web4.dev',
    port: 80,          // or 443 with https: true
    https: {
      key: fs.readFileSync('web4.dev-key.pem'),
      cert: fs.readFileSync('web4.dev.pem'),
    },
  },
}
