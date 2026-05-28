import { defineConfig } from 'vite';
import pluginReact from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  define: {
    'process.env': {}
  }
})