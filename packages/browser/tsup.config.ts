import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["iife"],
  target: "es6",
  platform: "browser",
  minify: true,
  clean: true,
  dts: true,
  outExtension: () => ({ js: ".js", dts: ".d.ts" }),
});
