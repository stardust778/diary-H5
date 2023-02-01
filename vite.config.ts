import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import styleImport from 'vite-plugin-style-import';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    styleImport(
      {
        libs: [
          {
            libraryName: 'zarm',
            esModule: true,
            resolveStyle: (name) => {
              return `zarm/es/${name}/style/css`;
            },
          }
        ]
      }
    )
  ],
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '')  // // 将 /api 重写为空
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),  // src路径
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx']
  }
})
