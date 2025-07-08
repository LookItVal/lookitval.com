import Socials from "./components/Socials/Socials.vue";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    buildAssetsDir: "assets",
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/stylesheet.css'],
  modules: ['@nuxt/content', '@nuxt/icon'],
  content: {
  },
  mdc: {
    components: {
      map: {
        section: 'WunschFlamingoSection'
      }
    }
  },
  devServer: {
    host: '0.0.0.0', //If WSL, run `netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=localhost
    port: 3000 // If WSL, connect to the windows machine IP address, not the one listed it the console. (should be 192.168.x.x)
  }
})