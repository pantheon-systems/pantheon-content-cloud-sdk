import { defineConfig } from "tsup";

export default defineConfig({
  treeshake: true,
  minify: true,
  clean: true,
  dts: true,
  splitting: false,
  target: "es2019",
  outDir: "dist",
  globalName: "PccVue",
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  external: [],
  outExtension: ({ format }) => {
    if (format === "iife") return { js: ".global.js" };
    if (format === "cjs") return { js: ".cjs" };
    if (format === "esm") return { js: ".mjs" };
    return { js: ".js" };
  },
  esbuildPlugins: [],
});
