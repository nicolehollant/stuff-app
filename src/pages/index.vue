<template>
  <SafeTeleport to="#header-trailing">
    <div class="sm:flex items-center -space-x-px hidden">
      <NuxtLink
        v-slot="{ navigate, href }"
        custom
        :to="{
          path: '/',
          query: {
            mode: 'day',
            date: $route.query?.date,
          },
        }"
      >
        <SenpButton
          size="xs"
          class="h-max"
          :href="href"
          square
          :classes="{
            button: [
              'px-3 border border-gray-800 !rounded-r-none',
              mode === 'day' ? '!bg-gray-800' : '!bg-gray-900',
            ],
          }"
          intent="secondary"
          @click="navigate"
        >
          <span class="hidden sm:inline">Day</span>
          <span class="sm:hidden">D</span>
        </SenpButton>
      </NuxtLink>
      <NuxtLink
        v-slot="{ navigate, href }"
        custom
        :to="{
          path: '/',
          query: {
            mode: 'week',
            date: $route.query?.date,
          },
        }"
      >
        <SenpButton
          size="xs"
          class="h-max"
          :href="href"
          square
          :classes="{
            button: [
              'px-3 border border-gray-800 !rounded-none',
              mode === 'week' ? '!bg-gray-800' : '!bg-gray-900',
            ],
          }"
          intent="secondary"
          @click="navigate"
        >
          <span class="hidden sm:inline">Week</span>
          <span class="sm:hidden">W</span>
        </SenpButton>
      </NuxtLink>
      <NuxtLink
        v-slot="{ navigate, href }"
        custom
        :to="{
          path: '/',
          query: {
            mode: 'month',
            date: $route.query?.date,
          },
        }"
      >
        <SenpButton
          size="xs"
          class="h-max"
          :href="href"
          square
          :classes="{
            button: [
              'px-3 border border-gray-800 !rounded-l-none',
              mode === 'month' ? '!bg-gray-800' : '!bg-gray-900',
            ],
          }"
          intent="secondary"
          @click="navigate"
        >
          <span class="hidden sm:inline">Month</span>
          <span class="sm:hidden">M</span>
        </SenpButton>
      </NuxtLink>
    </div>
    <SenpMenu
      class="sm:hidden"
      side="right"
      :options="[
        { label: 'Day', emits: 'day' },
        { label: 'Week', emits: 'week' },
        { label: 'Month', emits: 'month' },
      ]"
      @select="
        (key: 'day' | 'week' | 'month') => {
          if (key === 'day') {
            router.push({
              path: '/',
              query: {
                mode: 'day',
                date: $route.query?.date,
              },
            })
          }
          if (key === 'week') {
            router.push({
              path: '/',
              query: {
                mode: 'week',
                date: $route.query?.date,
              },
            })
          }
          if (key === 'month') {
            router.push({
              path: '/',
              query: {
                mode: 'month',
                date: $route.query?.date,
              },
            })
          }
        }
      "
    >
      <template #trigger
        ><SenpButton
          square
          :classes="{
            button: [
              'px-2 border border-gray-800',
              mode === 'month' ? '!bg-gray-800' : '!bg-gray-900',
            ],
          }"
          intent="secondary"
          size="xs"
          leading="mdi:calendar"
      /></template>
    </SenpMenu>
  </SafeTeleport>
  <FeedDay v-if="mode === 'day'"></FeedDay>
  <FeedWeek v-if="mode === 'week'"></FeedWeek>
  <FeedMonth v-if="mode === 'month'"></FeedMonth>
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
