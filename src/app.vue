<template>
  <div class="h-full overflow-auto">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <SenpToastProvider></SenpToastProvider>
  </div>
</template>

<style>
body,
html,
#__nuxt {
  @apply h-full w-full !bg-gray-950 text-white overflow-auto !bg-none;
}
</style>
