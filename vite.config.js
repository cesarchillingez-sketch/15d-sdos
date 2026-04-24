import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This must match your exact GitHub repository name!
  // If your repo is named '15d-sdos', leave it like this.
  base: '/15d-sdos/', 
})
