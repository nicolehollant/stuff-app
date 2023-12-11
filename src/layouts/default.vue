<template>
  <SenpLayoutBasic
    fixed-header
    fixed-footer
    :classes="{
      header: {
        extend:
          '!justify-between text-xl bg-gray-950/60 backdrop-blur border-b border-gray-900',
      },
      content: {
        extend: '!p-0  h-full',
      },
      footer: {
        extend:
          '!p-0 h-14 bg-gray-950/60 backdrop-blur border-t border-gray-900',
      },
      contentWrapper: {
        base: 'overflow-auto grid h-full ',
      },
      wrapper: {
        extend: '!overflow-visible !grid-rows-[auto,minmax(0,1fr),auto]',
      },
    }"
  >
    <template #header>
      <AppLogo
        size="lg"
        class="md:w-[calc(200px-1rem)] shrink-0"
        :classes="{ text: 'hidden md:flex' }"
      ></AppLogo>
      <TeleportTarget id="header-trailing"></TeleportTarget>
    </template>
    <template #footer>
      <ul class="flex items-center gap-4 h-full w-full justify-around">
        <li v-for="link in navigation.links" :key="link.to" class="pb-1 h-full">
          <NuxtLink
            :to="link.to"
            active-class="!text-blue-500 dark:!text-blue-400 !border-blue-500 dark:!border-blue-400"
            class="h-full text-base transition duration-200 hover:!text-purple-500 hover:dark:!text-purple-400 flex items-center gap-3 border-t border-transparent hover:border-gray-200/50 dark:hover:border-gray-800/50 text-gray-700 dark:text-gray-400/80"
          >
            <Icon v-if="link.icon" :name="link.icon"></Icon>
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </template>

    <template #content>
      <slot />
    </template>
  </SenpLayoutBasic>
</template>

<script setup lang="ts">
const navigation = reactive({
  links: [
    {
      to: "/",
      label: "Home",
      icon: "mdi:home",
    },
    {
      to: "/feed",
      label: "Feed",
      icon: "mdi:calendar",
    },
  ],
})
</script>
