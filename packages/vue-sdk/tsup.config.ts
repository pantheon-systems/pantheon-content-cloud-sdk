import GlobalsPlugin from "esbuild-plugin-globals";
import { defineConfig } from "tsup";

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
  entry: [
    "src/index.ts",
    "src/components/index.ts",
    // Different entry points for different environments so optional peer dependencies
    // don't cause issues.
    "src/platforms/nuxt.ts",
  ],
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
