// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Mustachio',        // optional, mostly for UMD
      formats: ['es'],
      fileName: 'index',
    },
  },
});
