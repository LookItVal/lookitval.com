// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    cdnURL: 'https://raw.githubusercontent.com/LookItVal/lookitval.github.io/refs/heads/main/docs/'
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/stylesheet.css']
})
