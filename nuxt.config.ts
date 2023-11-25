// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  supabase: {
    redirect: false,
  },
  runtimeConfig: {
    public: {
      SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    },
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
