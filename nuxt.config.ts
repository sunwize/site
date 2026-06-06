import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  site: {
    url: "https://colinclisson.com",
    name: "Colin Clisson",
    indexable: true,
  },
  modules: [
    "@nuxt/content",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/seo",
    "nuxt-ai-ready",
  ],
  css: ["~/assets/css/main.css"],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: "github-light",
            dark: "github-dark",
          },
          langs: [
            "bash",
            "css",
            "html",
            "js",
            "jsx",
            "json",
            "md",
            "ts",
            "tsx",
            "vue",
            "yaml",
          ],
        },
      },
    },
    renderer: {
      anchorLinks: {
        h2: true,
        h3: true,
        h4: true,
      },
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        exactOptionalPropertyTypes: true,
        noUnusedLocals: true,
      },
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/", "/blog", "/blog/tags", "/projects"],
    },
    typescript: {
      tsConfig: {
        compilerOptions: {
          exactOptionalPropertyTypes: true,
          noUnusedLocals: true,
        },
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    typedPages: true,
    viewTransition: true,
  },
});
