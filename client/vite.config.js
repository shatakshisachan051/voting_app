import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://voting-app-1naw.onrender.com',
      '/models': 'https://voting-app-1naw.onrender.com',
      '/uploads': 'https://voting-app-1naw.onrender.com'
    }
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://voting-app-1naw.onrender.com')
  }
});
