import { defineConfig } from "tsup";
import GlobalsPlugin from "esbuild-plugin-globals";

export default defineConfig({
  treeshake: true,
  minify: true,
  clean: true,
  dts: true,
  splitting: false,
  sourcemap: "inline",
  target: "es2019",
  outDir: "dist",
  globalName: "PccVue",
  entry: ["src/index.ts", "src/components/index.ts"],
  format: ["cjs", "esm"],
  external: ["vue", "vue-demi"],
  outExtension: ({ format }) => {
    if (format === "iife") return { js: ".global.js" };
    if (format === "cjs") return { js: ".cjs" };
    if (format === "esm") return { js: ".mjs" };
    return { js: ".js" };
  },
  esbuildPlugins: [
    GlobalsPlugin({
      vue: "Vue",
      "vue-demi": "VueDemi",
    }),
  ],
});
