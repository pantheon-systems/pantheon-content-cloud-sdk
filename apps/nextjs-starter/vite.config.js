import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    test: {
      globals: true,
      coverage: {
        reportsDirectory: `./coverage`,
      },
      setupFiles: ["./setupVitest.js"],
    },
    plugins: [react()],
  };
});
