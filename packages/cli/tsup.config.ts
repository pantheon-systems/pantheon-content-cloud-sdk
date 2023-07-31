import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli/index.ts'],
  treeshake: true,
  sourcemap: 'inline',
  minify: true,
  clean: true,
  splitting: false,
  format: ['esm'],
});
