// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/ui",
    "nuxt-charts",
  ],

  /* Nuxt UI */
  css: ["~/assets/css/main.css"],

  /* Fonts */
  fonts: {
    families: [
      {
        name: "JetBrains Mono",
        provider: "google",
        weights: [400, 500, 700],
      },
    ],
  },

  /* eslint */
  eslint: {
    config: {
      standalone: false,
    },
  },

  /* app config */
  app: {
    head: {
      title: "Foreign Exchange Checker",
      htmlAttrs: {
        lang: "en",
      },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
      meta: [
        {
          name: "description",
          content: "To compare exchange rates for currencies.",
        },
        {
          property: "og:description",
          content: "To compare exchange rates for currencies.",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:image",
          content: "https://foreign-exchange-checker-seven.vercel.app/foreign-exchange-checker-share-image.png",
        },
        {
          property: "og:image:width",
          content: "1200",
        },
        {
          property: "og:image:height",
          content: "630",
        },
      ],
    },
  },
});
