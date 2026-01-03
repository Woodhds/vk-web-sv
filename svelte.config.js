import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-vercel";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    runes: true,
  },
  preprocess: vitePreprocess({
    style: {
      css: "postcss.config.js",
    },
  }),
  kit: {
    adapter: adapter({
      runtime: "experimental_bun1.x",
    }),
    experimental: {
      remoteFunctions: true,
    },
  },
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
};

export default config;
