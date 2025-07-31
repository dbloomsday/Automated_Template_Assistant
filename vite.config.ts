import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
    server: {
    proxy: {
      '/ic': {
        target: 'https://core.instantcard.net/api',
        changeOrigin: true,
        secure: true,

        // ─────────────────────────────────────────────
        // 1)  /ic/v2/*  →  /v2/*      (keep v‑2 intact)
        // 2)  /ic/*     →  /v1/*      (prepend v‑1 for everything else)
        // ─────────────────────────────────────────────
        rewrite: (path) =>
          path
            .replace(/^\/ic\/v2/, '/v2')
            .replace(/^\/ic\//, '/v1/'),

        /* … cookie‑rewrite code stays the same … */
        configure(proxy) {
          proxy.on('proxyRes', (res) => {
            const set = res.headers['set-cookie'];
            if (Array.isArray(set)) {
              res.headers['set-cookie'] = set.map((c) =>
                c.replace(/;\s*Domain=[^;]+/i, '')
                .replace(/;\s*SameSite=Lax/i, '; SameSite=None')
                .replace(/;\s*Secure/i, ''),
              );
            }
          });
        },
      },
    },
  },
});