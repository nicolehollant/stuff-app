import VueSafeTeleport from "vue-safe-teleport"

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.use(VueSafeTeleport)
})
