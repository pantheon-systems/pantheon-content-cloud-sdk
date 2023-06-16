import { defineConfig } from "tsup";

export default defineConfig({
  treeshake: true,
  minify: true,
  clean: true,
  dts: true,
  splitting: false,
  sourcemap: "inline",
  outDir: "dist",
  target: "node16",
  entry: ["src/index.ts", "src/components/index.ts"],
  format: ["cjs", "esm"],
  external: ["react"],
  outExtension: ({ format }) => {
    if (format === "iife") return { js: ".global.js" };

    if (format === "cjs") return { js: ".cjs" };

    if (format === "esm") return { js: ".mjs" };

    return { js: ".js" };
  },
});
