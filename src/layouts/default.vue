<template>
  <SenpLayoutBasic
    fixed-header
    sidebar-left
    :classes="{
      header: {
        extend:
          '!justify-start text-xl bg-gray-950/60 backdrop-blur border-b border-gray-900',
      },
      sidebarLeft: {
        extend: '!px-0 !hidden md:!flex bg-gray-950 w-[200px] !fixed top-16',
      },
      content: {
        extend: 'md:ml-[200px]',
      },
      footer: {
        extend: 'hidden',
      },
      contentWrapper: {
        base: 'overflow-auto grid h-full',
      },
      wrapper: {
        extend: '!overflow-visible',
      },
    }"
  >
    <template #header>
      <AppLogo
        size="lg"
        class="md:w-[calc(200px-1rem)] shrink-0"
        :classes="{ text: 'hidden md:flex' }"
      ></AppLogo>
      <div class="flex items-center gap-4 w-full">
        <div id="header-leading"></div>
        <SenpButton
          class="ml-auto md:hidden"
          leading="mdi:menu"
          intent="ghost"
          @click="navigation.open = !navigation.open"
        ></SenpButton>
      </div>
    </template>

    <template #content>
      <slot />
    </template>
    <template #sidebar-left>
      <ul
        v-for="group in navigation.groups"
        :key="group.label"
        class="mb-4 sticky top-4 pl-4 pr-16"
      >
        <p v-if="!group.hideLabel" class="mb-2 capitalize text-lg font-medium">
          {{ group.label }}
        </p>

        <li v-for="link in group.links" :key="[group.label, link.to].join()">
          <NuxtLink
            :to="link.to"
            active-class="!text-blue-500 dark:!text-blue-400 !border-blue-500 dark:!border-blue-400"
            class="text-base transition duration-200 hover:!text-purple-500 hover:dark:!text-purple-400 pl-3 py-1 flex items-center gap-3 border-l border-gray-200/50 dark:border-gray-800/50 text-gray-700 dark:text-gray-400/80"
          >
            <Icon v-if="link.icon" :name="link.icon"></Icon>
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </template>
  </SenpLayoutBasic>
  <SenpDrawer
    v-model:open="navigation.open"
    class="[&_.px-6.pb-6.h-full]:!px-4"
    :classes="{
      maxSize: {
        base: 'w-full max-h-full max-w-[max(60vw,12rem)] lg:max-w-xl h-full !bg-gray-950/80 backdrop-blur-lg border-r-2 border-gray-900/60',
      },
    }"
    side="left"
    title="Brainstorm"
  >
    <template #title>
      <div
        class="flex items-center justify-between sticky top-0 bg-gray-950/50 border-b border-gray-900 backdrop-blur shadow h-16 text-lg leading-6 px-4"
      >
        <HeadlessDialogTitle as="h3">
          <AppLogo size="lg" />
        </HeadlessDialogTitle>
        <SenpButton
          leading="mdi:close"
          intent="ghost"
          @click="navigation.open = false"
        ></SenpButton>
      </div>
    </template>
    <ul v-for="group in navigation.groups" :key="group.label" class="mb-4">
      <p v-if="!group?.hideLabel" class="mb-2 capitalize text-sm font-medium">
        {{ group.label }}
      </p>

      <li v-for="link in group.links" :key="[group.label, link.to].join()">
        <NuxtLink
          :to="link.to"
          active-class="!text-blue-500 dark:!text-blue-400 !border-blue-500 dark:!border-blue-400"
          class="text-sm transition duration-200 hover:!text-purple-500 hover:dark:!text-purple-400 pl-3 font-medium py-1 flex items-center gap-1 border-l border-gray-200/50 dark:border-gray-800/50 text-gray-700 dark:text-gray-300"
        >
          <Icon v-if="link.icon" :name="link.icon"></Icon>
          {{ link.label }}
        </NuxtLink>
      </li>
    </ul>
  </SenpDrawer>
</template>

<script setup lang="ts">
const navigation = reactive({
  open: false,
  groups: [
    {
      hideLabel: true,
      label: "Brainstorm",
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
        {
          to: "/protected",
          label: "Protected",
          icon: "mdi:eye-off",
        },
        {
          to: "/trpc",
          label: "trpc",
          icon: "mdi:server",
        },
      ],
    },
  ],
})
</script>
