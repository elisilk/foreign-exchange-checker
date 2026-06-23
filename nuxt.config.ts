// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/ui",
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
});
