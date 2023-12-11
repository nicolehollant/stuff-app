<template>
  <div
    v-if="feedState.date"
    class="grid grid-rows-[auto,minmax(0,1fr)] gap-4 h-full overflow-auto"
  >
    <div class="flex items-center justify-between gap-4 px-4 pt-4">
      <div>
        <h1 class="text-xl">
          {{
            DateTime.fromISO(feedState.date).toLocaleString(DateTime.DATE_FULL)
          }}
        </h1>
        <p class="text-xs text-gray-500">
          {{
            DateTime.fromISO(feedState.date).toLocaleString(DateTime.DATE_SHORT)
          }}
        </p>
      </div>
      <div class="flex items-center -space-x-px">
        <NuxtLink :to="`/feed?date=${feedPagination.prev}`">
          <SenpButton
            size="sm"
            square
            :classes="{
              button: '!bg-gray-900 border border-gray-800 !rounded-r-none',
            }"
            intent="secondary"
            leading="mdi:chevron-left"
          />
        </NuxtLink>
        <NuxtLink :to="`/feed?date=${feedPagination.today}`">
          <SenpButton
            size="sm"
            square
            label="Today"
            :classes="{
              button: '!bg-gray-900 border border-gray-800 !rounded-none',
            }"
            intent="secondary"
          />
        </NuxtLink>
        <NuxtLink :to="`/feed?date=${feedPagination.next}`">
          <SenpButton
            size="sm"
            square
            :classes="{
              button: '!bg-gray-900 border border-gray-800 !rounded-l-none',
            }"
            intent="secondary"
            leading="mdi:chevron-right"
          />
        </NuxtLink>
      </div>
    </div>
    <p v-if="getStuffTypes.loading.value" class="px-4">loading...</p>
    <div class="grid md:grid-cols-2 gap-4 h-full px-4 overflow-auto">
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

const route = useRoute()
const router = useRouter()

const {
  feedState,
  feedPagination,
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
    router.push(`/feed?date=${date}`)
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
