import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// The site is fully static (no SSR endpoints). Cloudflare Pages serves
// dist/ directly without an adapter; the @astrojs/cloudflare adapter is
// only needed when you want Worker-backed SSR routes. If a Phase 2
// feature (e.g. a tip-intake Worker per BRIEF.md Section 3) ever needs
// SSR, add the adapter back at that point.
const SITE = "https://keralapromises.in";

export default defineConfig({
  site: SITE,
  output: "static",
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { format: "directory" },
  trailingSlash: "ignore",
});
