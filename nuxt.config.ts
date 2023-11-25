// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  supabase: {
    redirect: false,
  },

  modules: ["senp-ui", "@nuxtjs/supabase"],
  build: {
    transpile: ["trpc-nuxt"],
  },
  senpui: {
    global: true,
    prefix: "",
  },
  // ssr: false,
  srcDir: "./src",
  typescript: {
    shim: false,
  },
})
