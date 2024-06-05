import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/components/index.ts", "src/server/index.ts"],
  treeshake: true,
  sourcemap: true,
  minify: true,
  clean: true,
  dts: true,
  splitting: false,
  format: ["cjs", "esm"],
  external: ["react"],
});
