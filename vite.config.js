import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      strategies: 'generateSW',
        manifest: {
          name: 'Presensi SMA',
          short_name: 'Presensi',
          description: 'Sistem Manajemen Kehadiran Siswa SMA',
          lang: 'id',
          theme_color: '#6366f1',
          background_color: '#f8fafc',
          display: 'standalone',
          scope: '/',
          start_url: '/',
        icons: [
          {
            src: 'pwa/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/presensi_sma_backend\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === 'https://cdnjs.cloudflare.com' ||
              url.href.includes('fontawesome') ||
              url.href.includes('fonts.googleapis.com') ||
              url.href.includes('fonts.gstatic.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'presensi-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url, request }) =>
              (url.pathname.includes('/api/') || url.pathname.includes('/presensi_sma_backend/')) &&
              request.method === 'GET' &&
              !url.pathname.includes('/auth/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'presensi-api-get',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url, request }) =>
              (url.pathname.includes('/api/') || url.pathname.includes('/presensi_sma_backend/')) &&
              (url.pathname.includes('/auth/') || request.method !== 'GET'),
            handler: 'NetworkOnly',
            options: { cacheableResponse: { statuses: [0, 200] } },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      },
      '/presensi_sma_backend': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: 'index.html'
      }
    }
  }
});
