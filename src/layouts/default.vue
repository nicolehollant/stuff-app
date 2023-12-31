<template>
  <SenpLayoutBasic
    fixed-header
    fixed-footer
    :classes="{
      header: {
        extend:
          '!fixed w-full !justify-between text-xl bg-gray-950/60 backdrop-blur border-b border-gray-900',
      },
      content: {
        extend: '!pt-16 !p-0 !grid   h-full',
      },
      footer: {
        extend:
          '!p-0 h-14 bg-gray-950/60 backdrop-blur border-t border-gray-900',
      },
      contentWrapper: {
        base: 'overflow-auto grid h-full ',
      },
      wrapper: {
        extend: '!overflow-visible !grid-rows-[1fr,auto] ',
      },
    }"
  >
    <template #header>
      <div class="flex gap-4">
        <AppLogo
          size="lg"
          class="shrink-0"
          :classes="{ text: 'hidden md:flex' }"
        ></AppLogo>
        <TeleportTarget id="header-leading" class="flex gap-2"></TeleportTarget>
      </div>
      <TeleportTarget id="header-center" class="flex gap-2"></TeleportTarget>
      <div class="flex gap-2">
        <TeleportTarget
          id="header-trailing-before"
          class="flex gap-2"
        ></TeleportTarget>
        <TeleportTarget
          id="header-trailing"
          class="flex gap-2"
        ></TeleportTarget>
      </div>
    </template>
    <template #footer>
      <ul class="flex items-center gap-4 h-full w-full justify-around">
        <li class="pb-1 h-full">
          <NuxtLink
            to="/"
            active-class="!text-blue-500 dark:!text-blue-400 !border-blue-500 dark:!border-blue-400"
            class="h-full text-base transition duration-200 hover:!text-purple-500 hover:dark:!text-purple-400 flex items-center gap-3 border-t border-transparent hover:border-gray-200/50 dark:hover:border-gray-800/50 text-gray-700 dark:text-gray-400/80"
          >
            <Icon class="w-5 h-5" name="mdi:calendar"></Icon>
            Feed
          </NuxtLink>
        </li>
        <li class="pb-1 h-full">
          <NuxtLink
            to="/settings"
            active-class="!text-blue-500 dark:!text-blue-400 !border-blue-500 dark:!border-blue-400"
            class="h-full text-base transition duration-200 hover:!text-purple-500 hover:dark:!text-purple-400 flex items-center gap-3 border-t border-transparent hover:border-gray-200/50 dark:hover:border-gray-800/50 text-gray-700 dark:text-gray-400/80"
          >
            <Icon class="w-5 h-5" name="mdi:cog"></Icon>
            Settings
          </NuxtLink>
        </li>
        <li class="pb-1 h-full">
          <NuxtLink
            to="/profile"
            active-class="!text-blue-500 dark:!text-blue-400 !border-blue-500 dark:!border-blue-400"
            class="h-full text-base transition duration-200 hover:!text-purple-500 hover:dark:!text-purple-400 flex items-center gap-3 border-t border-transparent hover:border-gray-200/50 dark:hover:border-gray-800/50 text-gray-700 dark:text-gray-400/80"
          >
            <SenpAvatar
              rounded="sm"
              :classes="{ avatar: 'w-5 h-5' }"
              :src="avatar.src"
              :alt="avatar.username"
            ></SenpAvatar>
            Profile
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
const { avatar, downloadImage, getUser } = useSupabaseAvatar()
downloadImage()
</script>
