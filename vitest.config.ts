import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom", // ✅ Use jsdom to simulate a browser
        // setupFiles: "./test/setup.ts",
    },
});