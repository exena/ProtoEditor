import { defineConfig } from 'vite';

// Vite 설정
export default defineConfig({
  base: './', // 상대 경로로 설정해야 GitHub Pages에서 잘 작동함
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: `protoeditor.js`,
        assetFileNames: `protoeditor.[ext]`,
      },
    },
  },
});