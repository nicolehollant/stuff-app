<template>
  <div class="flex">
    <NuxtLink
      v-if="mode !== 'month'"
      :to="`/?date=${feedPagination.week.prev}&mode=${mode}`"
      class="snap-center snap-always overflow-hidden w-8 md:w-12 shrink-0"
      @click="$emit('change', 0)"
    >
      <div
        class="pt-2 h-full w-full hover:bg-gray-900/50 transition duration-200 pb-1 flex flex-col items-center justify-center border-b border-dashed border-gray-900"
      >
        <Icon name="mdi:chevron-left"></Icon>
      </div>
    </NuxtLink>
    <NuxtLink
      v-for="dayOffset of 7"
      :key="dayOffset"
      :to="`/?date=${dateBounds.week.gte
        .plus({ day: dayOffset + (weekOffset ?? 0) - 1 })
        .toISODate()}&mode=${mode}`"
      class="snap-center snap-always overflow-hidden w-full"
      @click="$emit('change', dayOffset - 1)"
    >
      <div
        class="pt-2 w-full hover:bg-gray-900/50 transition duration-200 pb-1 flex flex-col items-center justify-center border-b border-dashed border-gray-900"
      >
        <p
          class="text-center text-xs text-gray-400 font-semibold"
          :class="{
            'flex items-center justify-center h-7': mode === 'month',
          }"
        >
          <span class="hidden sm:inline">
            {{
              dateBounds.week.gte.plus({
                day: dayOffset + (weekOffset ?? 0) - 1,
              }).weekdayShort
            }}
          </span>
          <span class="sm:hidden">
            {{
              dateBounds.week.gte
                .plus({ day: dayOffset + (weekOffset ?? 0) - 1 })
                .weekdayShort?.at(0)
            }}
          </span>
        </p>
        <span
          v-if="mode !== 'month'"
          class="flex items-center justify-center w-7 h-7 rounded-full"
          :class="{
            'bg-blue-500 text-gray-950 ':
              feedState.date ===
              dateBounds.week.gte
                .plus({ day: dayOffset + (weekOffset ?? 0) - 1 })
                .toISODate(),
          }"
          >{{
            dateBounds.week.gte.plus({ day: dayOffset + (weekOffset ?? 0) - 1 })
              .day
          }}</span
        >
      </div>
    </NuxtLink>
    <NuxtLink
      v-if="mode !== 'month'"
      :to="`/?date=${feedPagination.week.next}&mode=${mode}`"
      class="snap-center snap-always overflow-hidden w-8 md:w-12 shrink-0"
      @click="$emit('change', 0)"
    >
      <div
        class="pt-2 h-full w-full hover:bg-gray-900/50 transition duration-200 pb-1 flex flex-col items-center justify-center border-b border-dashed border-gray-900"
      >
        <Icon name="mdi:chevron-right"></Icon>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { DateTime } from "luxon"

defineProps<{
  mode: "day" | "week" | "month"
  feedPagination: {
    prev: string | null
    next: string | null
    today: string
    day: { prev: string | null; next: string | null }
    week: { prev: string | null; next: string | null }
    month: { prev: string | null; next: string | null }
  }
  dateBounds: {
    day: {
      gte: DateTime
      lte: DateTime
    }
    week: {
      gte: DateTime
      lte: DateTime
    }
    month: {
      gte: DateTime
      lte: DateTime
    }
  }
  feedState: { date: string }
  weekOffset?: number
}>()

defineEmits<{
  (event: "change", value: number): void
}>()
</script>
