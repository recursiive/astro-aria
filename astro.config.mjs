import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind()],
	output: "hybrid", // Enable hybrid mode for API routes while keeping pages static
	adapter: vercel(),
});
