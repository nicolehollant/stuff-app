<template>
  <SafeTeleport to="#header-trailing">
    <div class="flex items-center -space-x-px">
      <NuxtLink
        :to="{
          path: '/feed',
          query: {
            mode: 'day',
            date: $route.query?.date,
          },
        }"
      >
        <SenpButton
          size="sm"
          square
          :classes="{
            button: [
              'px-4 border border-gray-800 !rounded-r-none',
              mode === 'day' ? '!bg-gray-800' : '!bg-gray-900',
            ],
          }"
          intent="secondary"
          label="Day"
        />
      </NuxtLink>
      <NuxtLink
        :to="{
          path: '/feed',
          query: {
            mode: 'week',
            date: $route.query?.date,
          },
        }"
      >
        <SenpButton
          size="sm"
          square
          label="Week"
          :classes="{
            button: [
              'px-4 border border-gray-800 !rounded-none',
              mode === 'week' ? '!bg-gray-800' : '!bg-gray-900',
            ],
          }"
          intent="secondary"
        />
      </NuxtLink>
      <NuxtLink
        :to="{
          path: '/feed',
          query: {
            mode: 'month',
            date: $route.query?.date,
          },
        }"
      >
        <SenpButton
          size="sm"
          square
          :classes="{
            button: [
              'px-4 border border-gray-800 !rounded-l-none',
              mode === 'month' ? '!bg-gray-800' : '!bg-gray-900',
            ],
          }"
          intent="secondary"
          label="Month"
        />
      </NuxtLink>
    </div>
  </SafeTeleport>
  <FeedDay v-if="mode === 'day'"></FeedDay>
  <FeedWeek v-if="mode === 'week'"></FeedWeek>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const mode = ref<"day" | "week" | "month">(
  ["day", "week", "month"].includes(route.query?.mode + "")
    ? ((route.query?.mode + "") as "day" | "week" | "month")
    : "day",
)

watch(
  () => route.query?.mode,
  () => {
    if (["day", "week", "month"].includes(route.query?.mode + "")) {
      mode.value = (route.query?.mode + "") as "day" | "week" | "month"
    }
  },
)
</script>
