// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "shadcn-nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
  ],
  ssr: false,
  devtools: { enabled: true },
  css: ["../tailwind.css"],
  colorMode: {
    preference: "system",
    fallback: "light",
    classPrefix: "",
    classSuffix: "",
    storageKey: "qigu-color-scheme",
  },
  runtimeConfig: {
    public: {
      api: {
        key: "",
        1: "",
        2: "",
      },
      platform: "",
    },
  },
  srcDir: "app/",
  compatibilityDate: "2025-07-15",
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  eslint: {
    checker: true,
    config: {
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
      },
    },
  },
  googleFonts: {
    families: {
      Inter: "100..900",
    },
  },
  i18n: {
    locales: [
      { code: "en", iso: "en-US", name: "English", file: "en-US.json" },
      { code: "fr", iso: "fr-FR", name: "Français", file: "fr-FR.json" },
      { code: "de", iso: "de-DE", name: "Deutsch", file: "de-DE.json" },
    ],
    defaultLocale: "fr",
    strategy: "prefix_except_default",
    langDir: "../i18n/locales",
  },
  shadcn: {
    prefix: "",
    componentDir: "app/components/ui",
  },
});
