import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import adapter from "@sveltejs/adapter-vercel"

/** @type {import('@sveltejs/kit').Config} */
const config = {
    compilerOptions: {
        runes: true,
    },
    preprocess: vitePreprocess({
        style: {
            css: "postcss.config.js"
        }
    }),
    kit: {
        adapter: adapter()
    }
};

export default config