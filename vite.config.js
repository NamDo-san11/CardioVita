import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'salud.png',
        'icons/salud512x512.png',
        'icons/salud128x128.png'
      ],
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico,webmanifest}'],
        maximumFileSizeToCacheInBytes: 5000000, // 🔧 aumenta el límite a 5 MB
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin.includes('firestore.googleapis.com') ||
              url.origin.includes('firebase.googleapis.com') ||
              url.origin.includes('firebaseio.com'),
            handler: 'NetworkOnly',
            options: {
              cacheName: 'firebase-excluded'
            }
          }
        ]
      }
    })
  ],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
