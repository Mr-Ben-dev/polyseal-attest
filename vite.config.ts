import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react-swc';
import { componentTagger } from 'lovable-tagger';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    noDiscovery: false,
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'wagmi',
      'viem',
      '@rainbow-me/rainbowkit',
      '@tanstack/react-query',
    ],
  },
  plugins: [mdx(), react(), mode === 'development' && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
