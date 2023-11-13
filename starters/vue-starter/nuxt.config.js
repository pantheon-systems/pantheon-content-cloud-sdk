// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  imports: {
    transform: {
      // Fix for monorepo support
      // You can remove this if you cloned this starter or used the pcc create command
      exclude: [/packages\/vue-sdk/],
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile: [/@pantheon-systems\/pcc-vue-sdk/],
  },
  runtimeConfig: {
    public: {
      siteId: process.env.PCC_SITE_ID,
    },
  },
});
