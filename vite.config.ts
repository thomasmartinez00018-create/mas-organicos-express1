import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Esto permite usar process.env.API_KEY sin que falle, aunque en Vite se recomienda import.meta.env
    'process.env': process.env
  }
});