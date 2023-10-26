import path from "path";
import GlobalsPlugin from "esbuild-plugin-globals";
import { defineConfig, Options } from "tsup";
import VuePlugin from "unplugin-vue/esbuild";

const injectCSSImportPlugin = {
  name: "string-replacement",
  setup(build) {
    build.onEnd((result) => {
      const outputs = result.outputFiles;

      const outputCSSFiles = outputs?.filter((output) =>
        output.path.endsWith(".css"),
      );

      if (!outputCSSFiles || outputCSSFiles.length < 1) return;

      // Find the sibling JS file. It will have the same path but instead of
      // `.css` it will be either `.cjs` or `.mjs`.
      const outputJSFiles = outputs?.filter(
        (output) =>
          output.path === outputCSSFiles[0].path.replace(".css", ".cjs") ||
          output.path === outputCSSFiles[0].path.replace(".css", ".mjs"),
      );

      if (!outputJSFiles || outputJSFiles.length < 1) return;

      const cssFile = outputCSSFiles[0];
      const jsFile = outputJSFiles[0];

      const relativePath = path.relative(
        path.dirname(jsFile.path),
        cssFile.path,
      );

      const isCJS = jsFile.path.endsWith(".cjs");
      const importStatement = isCJS
        ? `require("./${relativePath}");`
        : `import "./${relativePath}";`;

      // Convert the import statement to a byte array and prepend it to the JS file
      const importStatementArray = Buffer.from(`${importStatement}\n`);
      jsFile.contents = Buffer.concat([importStatementArray, jsFile.contents]);
    });
  },
} satisfies NonNullable<Options["esbuildPlugins"]>[number];

export default defineConfig({
  treeshake: true,
  minify: true,
  clean: true,
  dts: true,
  splitting: false,
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
    VuePlugin({
      style: {
        // @ts-expect-error - This is a valid option.
        preprocessLang: "scss",
      },
    }),
    injectCSSImportPlugin,
  ],
});
