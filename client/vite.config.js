import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],

  server: {
    host: true, // Allow external access
    port: 5173, // Ensure the port matches your setup
    allowedHosts: ['.loca.lt'], // Allow all loca.lt subdomains
  },
})
