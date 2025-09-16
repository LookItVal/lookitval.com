import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    https: false, // Set to true and provide certs to enable HTTPS
    // https: {
    //   key: './ssl/localhost-key.pem',
    //   cert: './ssl/localhost.pem'
    // },
    host: '0.0.0.0', //If WSL, run `netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=localhost`
    port: 3000 // If WSL, connect to the windows machine IP address, not the one listed it the console. (should be 192.168.x.x)
  },
  css: [
    '@/assets/main.css'
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['pyodide']
    }
  },
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/image', '@nuxt/ui', 'v-gsap-nuxt'],
  content: {
    watch: {
      hostname: 'localhost' // If HTTPS, set hostname to localhost to ensure WebSocket works
    }
  }
})