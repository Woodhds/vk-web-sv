import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig, loadEnv } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import dotenvExpand from "dotenv-expand";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "development") {
    const env = loadEnv(mode, process.cwd(), "");

    dotenvExpand.expand({ parsed: env });
  }

  return { plugins: [sveltekit(), tailwindcss(), devtoolsJson()] };
});
