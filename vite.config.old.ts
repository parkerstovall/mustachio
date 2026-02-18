// vite.config.ts
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  root: 'original',
  build: {
    lib: {
      entry: 'src-old/index.ts',
      name: 'Mustachio', // optional, mostly for UMD
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['phaser'],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
})
