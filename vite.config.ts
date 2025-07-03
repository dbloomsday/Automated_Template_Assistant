import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },

  server: {
    proxy: {
      '/ic/': {
        target: 'https://core.instantcard.net',
        changeOrigin: true,
        secure: true,
        rewrite: (p) =>
          p.replace(/^\/ic\/v2\//, '/api/v2/').replace(/^\/ic\//, '/api/'),
        configure(proxy) {
          proxy.on('proxyRes', (res) => {
            let cookies = res.headers['set-cookie'];
            if (!cookies) return;
            if (!Array.isArray(cookies)) cookies = [cookies];

            res.headers['set-cookie'] = cookies.map((c) =>
              c
                .replace(/Domain=[^;]+;?/i, '') // drop Domain
                .replace(/;\s*Secure/gi, ''),   // drop Secure
            );
          });
        },
      },
    },
  },
});
