// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    buildAssetsDir: "assets"
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/stylesheet.css'],
  modules: ['@nuxt/content', '@nuxt/icon'],
  content: {
  }  
})