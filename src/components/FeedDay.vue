<template>
  <div
    v-if="feedState.date"
    class="relative grid grid-rows-[auto,minmax(0,1fr)] h-full"
  >
    <FeedWeekdays
      mode="day"
      :feed-pagination="feedPagination"
      :date-bounds="dateBounds"
      :feed-state="feedState"
      class="sticky top-16 bg-gray-950/60 backdrop-blur"
    />
    <SafeTeleport to="#header-leading">
      <div class="w-max text-right h-16 flex items-center bg-gray-900/40 px-4">
        <h1 class="text-xl hidden md:inline-block leading-tight">
          <span class="font-black tracking-tight">
            {{
              [
                DateTime.fromISO(feedState.date).monthLong,
                DateTime.fromISO(feedState.date).day,
              ].join(" ")
            }},
          </span>
          <span class="font-light text-gray-200">
            {{ " " + DateTime.fromISO(feedState.date).year }}
          </span>
        </h1>
        <h1 class="md:hidden text-base">
          <span class="font-black tracking-tight">
            {{
              [
                DateTime.fromISO(feedState.date).monthShort,
                DateTime.fromISO(feedState.date).day,
              ].join(" ")
            }},
          </span>
          <span class="font-light text-gray-200">
            {{ " " + DateTime.fromISO(feedState.date).year }}
          </span>
        </h1>
      </div>
    </SafeTeleport>
    <SafeTeleport to="#header-trailing">
      <div class="flex -space-x-px">
        <NuxtLink
          v-slot="{ navigate, href }"
          custom
          :to="`/?date=${feedPagination.prev}`"
        >
          <SenpButton
            :href="href"
            size="xs"
            class="h-full"
            square
            :classes="{
              button: '!bg-gray-900 border border-gray-800 !rounded-r-none',
            }"
            intent="secondary"
            leading="mdi:chevron-left"
            @click="navigate"
          />
        </NuxtLink>
        <NuxtLink
          v-slot="{ navigate, href }"
          custom
          :to="`/?date=${feedPagination.today}`"
        >
          <SenpButton
            :href="href"
            size="xs"
            class="h-full"
            square
            :classes="{
              button: '!bg-gray-900 border border-gray-800 !rounded-none',
            }"
            intent="secondary"
            @click="navigate"
            >Today</SenpButton
          >
        </NuxtLink>
        <NuxtLink
          v-slot="{ navigate, href }"
          custom
          :to="`/?date=${feedPagination.next}`"
        >
          <SenpButton
            :href="href"
            size="xs"
            class="h-full"
            square
            :classes="{
              button: '!bg-gray-900 border border-gray-800 !rounded-l-none',
            }"
            intent="secondary"
            leading="mdi:chevron-right"
            @click="navigate"
          />
        </NuxtLink>
      </div>
    </SafeTeleport>
    <p
      v-if="!stuffTypes?.length && getStuffTypes.loading.value"
      class="px-4 mt-4"
    >
      loading...
    </p>
    <div class="mt-4 grid md:grid-cols-2 gap-4 h-full px-4 overflow-auto">
      <button
        v-for="stuff in stuffTypes"
        :key="stuff.id"
        class="outline-none focus:outline-none group text-left h-full"
        @click="() => editStuffType(stuff)"
      >
        <SenpCard
          class="border-2 border-gray-800/30 hover:!bg-gray-900/70 transition duration-200 group-focus:ring h-full"
        >
          <div class="">
            <p class="text-lg">{{ stuff.title }}</p>
            <p class="text-sm text-gray-400">{{ stuff.description }}</p>
          </div>
          <hr class="border-gray-700/30 border-dashed" />
          <div
            v-if="
              stuffEntries?.some((entry) => entry.stuff_type_id === stuff.id)
            "
            class="flex flex-col gap-4"
          >
            <pre class="whitespace-pre-wrap font-sans">{{
              stuffEntries.find((entry) => entry.stuff_type_id === stuff.id)
                ?.value
            }}</pre>
          </div>
          <p v-else>No entry yet</p>
        </SenpCard>
      </button>
      <div class="h-px col-span-full"></div>
    </div>
  </div>
  <SenpDrawer
    v-model:open="state.modalUp"
    :title="state.currentStuffType.title"
  >
    <div class="flex flex-col gap-4">
      <SenpTextInput
        v-model="state.currentEntry.value"
        multiline
        rows="10"
        :hint="state.currentStuffType.description"
      ></SenpTextInput>
      <div class="flex items-center gap-2">
        <SenpButton
          :loading="upsertStuffType.loading.value"
          @click="
            upsertStuffType
              .exec({
                stuff_type_id: state.currentStuffType.id!,
                value: state.currentEntry.value,
                id: state.currentEntry.id,
              })
              .then(() => {
                state.modalUp = false
              })
          "
          >Save Entry</SenpButton
        >
        <SenpButton
          v-if="state.currentStuffType.id != null"
          intent="destructive"
          :loading="deleteStuffType.loading.value"
          @click="
            deleteStuffType.exec(state.currentStuffType.id).then(() => {
              state.modalUp = false
            })
          "
          >Delete Entry</SenpButton
        >
      </div>
    </div>
  </SenpDrawer>
</template>

<script setup lang="ts">
import { DateTime } from "luxon"
import FeedWeekdays from "./FeedWeekdays.vue"

const route = useRoute()
const router = useRouter()

const {
  feedState,
  feedPagination,
  dateBounds,
  stuffTypes,
  stuffEntries,
  getStuffTypes,
  getStuffEntries,
  deleteStuffType,
  upsertStuffType,
} = useFeed({ mode: "day", watchDate: true })

const state = reactive({
  modalUp: false,
  currentStuffType: {
    id: undefined as undefined | number,
    title: "",
    description: "",
    datatype: "text",
    enabled: true,
  },
  currentEntry: {
    id: undefined as undefined | number,
    value: "",
  },
})

function editStuffType(val: typeof state.currentStuffType) {
  state.currentStuffType = val
  const matchingEntry = stuffEntries.value?.find(
    (entry) => entry.stuff_type_id === val.id,
  )
  if (matchingEntry) {
    state.currentEntry.id = matchingEntry.id
    state.currentEntry.value = matchingEntry.value
  } else {
    state.currentEntry.id = undefined
    state.currentEntry.value = ""
  }
  state.modalUp = true
}

onMounted(() => {
  if (!route.query?.date) {
    const date = DateTime.local().toISODate()
    router.push(`/?date=${date}`)
    return
  }
  const date = DateTime.fromISO(route.query.date + "")
  if (date.isValid) {
    feedState.date = date.toISODate()
  }
  getStuffTypes.exec()
  getStuffEntries.exec()
})
</script>
