import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['brand-mark.svg', 'brand-wordmark.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Code On The Go',
        short_name: 'CodeGo',
        description: 'A premium mobile AI coding workspace for building software from your phone.',
        theme_color: '#7c3aed',
        background_color: '#f8f5ff',
        display: 'fullscreen',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/brand-mark.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html'
      },
      devOptions: {
        enabled: true
      }
    })
  ]
});
