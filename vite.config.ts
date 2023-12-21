import { node } from '@liuli-util/vite-plugin-node';
import { defineConfig } from 'vite';

export default defineConfig({
  build: { target: 'src/index.ts' },
  plugins: [node()],
});
