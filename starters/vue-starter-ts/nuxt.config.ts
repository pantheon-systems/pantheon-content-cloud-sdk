// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      siteId: process.env.PCC_SITE_ID,
    },
  },
  imports: {
    transform: {
      exclude: [/\bdist\b/],
    },
  },
  // https://nuxt.com/modules/gtag
  /* Google Analytics: Replace XXXXXXXXXX with your google analytics id and uncomment the following code. */
  // modules: ["nuxt-gtag"],
  // gtag: {
  //   id: "G-XXXXXXXXXX",
  // },
});
