import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

const SITE = "https://keralapromises.in";

export default defineConfig({
  site: SITE,
  output: "static",
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: "compile",
  }),
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: "directory",
  },
  trailingSlash: "ignore",
});
