import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@pdfme/ui': path.resolve(__dirname, 'libs/@pdfme-ui/dist/index.es.js'),
      '@pdfme/common': path.resolve(__dirname, 'libs/@pdfme-common/dist/esm/src/index.js')
    }
  }
})
