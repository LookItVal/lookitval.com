// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: process.env.NODE_ENV === "production" ? "/lookitval.github.io/" : "/",
    buildAssetsDir: "assets",
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/stylesheet.css']
})
