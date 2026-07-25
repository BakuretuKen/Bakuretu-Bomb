import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        noanime: resolve(__dirname, 'index_noanime.html'),
      },
      output: {
        // 2つのHTMLが同じ src/main.ts を共有するため、実体のJSはエントリではなく共有チャンクとして出力される
        // （エントリチャンクは空になりビルド後に破棄される。固定名が衝突しないよう別パターンにする）
        entryFileNames: '[name].js',
        chunkFileNames: 'bakuretubomb300.js',
      },
    },
  },
});
