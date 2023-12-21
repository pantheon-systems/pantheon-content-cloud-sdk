import { defineConfig } from "tsup";

export default defineConfig({
  treeshake: true,
  minify: true,
  clean: true,
  dts: true,
  splitting: false,
  outDir: "dist",
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  external: ["react"],
});
