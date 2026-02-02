import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
   plugins: [
    react({
      // ensure automatic runtime so importing React is NOT required
      jsxRuntime: "automatic"
    })
  ]
})
