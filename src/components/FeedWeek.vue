<template>
  <div v-if="feedState.date" class="flex flex-col gap-4 grow overflow-hidden">
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
        <NuxtLink :to="`/feed?date=${feedPagination.prev}&mode=week`">
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
        <NuxtLink :to="`/feed?date=${feedPagination.today}&mode=week`">
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
        <NuxtLink :to="`/feed?date=${feedPagination.next}&mode=week`">
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
    <p v-if="getStuffTypes.loading.value">loading...</p>
    <div
      class="grid grid-flow-col auto-cols-[100%] px-4 md:grid-cols-7 md:w-full h-full overflow-y-hidden overflow-x-auto no-scrollbar edge-mask snap-x snap-mandatory"
    >
      <section
        v-for="dayOffset of 7"
        :key="dayOffset"
        class="snap-center snap-always grid grid-rows-[auto,minmax(0,1fr)] h-full overflow-hidden w-full"
      >
        <div
          class="h-10 flex items-center justify-center gap-2 border-b-2 border-gray-800"
        >
          <p class="text-center">
            {{ dateBounds.week.gte.plus({ day: dayOffset - 1 }).weekdayShort }}
          </p>
          <span
            class="flex items-center justify-center w-7 h-7 rounded-full"
            :class="{
              'bg-blue-500 text-gray-950 ':
                feedPagination.today ===
                dateBounds.week.gte.plus({ day: dayOffset - 1 }).toISODate(),
            }"
            >{{ dateBounds.week.gte.plus({ day: dayOffset - 1 }).day }}</span
          >
        </div>
        <div
          class="h-full overflow-auto border-l border-gray-800 border-b flex flex-col divide-y divide-gray-900 divide-dashed p-1"
          :class="{ 'border-r': dayOffset === 7 }"
        >
          <button
            v-for="(stuff, stuffIndex) in stuffTypes"
            :key="stuff.id"
            class="outline-none focus:outline-none group text-left"
            :class="{
              'pt-2': stuffIndex > 0,
              'pb-2': stuffIndex < (stuffTypes?.length || 0) - 1,
            }"
            @click="
              () =>
                editStuffType(
                  stuff,
                  dateBounds.week.gte.plus({ day: dayOffset - 1 }),
                )
            "
          >
            <SenpCard
              :classes="{ wrapper: { extend: '!p-2 !gap-2' } }"
              :class="{
                '!border-blue-800/40': stuffEntries?.some(
                  (entry) =>
                    entry.stuff_type_id === stuff.id &&
                    DateTime.fromISO(entry.entry_date).toISODate() ===
                      dateBounds.week.gte
                        .plus({ day: dayOffset - 1 })
                        .toISODate(),
                ),
              }"
              class="border-l-[4px] border-gray-800/40 !rounded-[4px] !bg-gray-900/70 hover:!bg-gray-900/40 transition duration-200 group-focus:ring h-full text-sm"
            >
              <div class="">
                <p class="text-sm text-gray-200">{{ stuff.title }}</p>
                <p class="text-xs text-gray-400">{{ stuff.description }}</p>
              </div>
              <hr class="border-gray-700/30 border-dashed" />
              <div
                v-if="
                  stuffEntries?.some(
                    (entry) =>
                      entry.stuff_type_id === stuff.id &&
                      DateTime.fromISO(entry.entry_date).toISODate() ===
                        dateBounds.week.gte
                          .plus({ day: dayOffset - 1 })
                          .toISODate(),
                  )
                "
                class="flex flex-col gap-4"
              >
                <pre class="whitespace-pre-wrap font-sans text-xs">{{
                  stuffEntries.find(
                    (entry) =>
                      entry.stuff_type_id === stuff.id &&
                      DateTime.fromISO(entry.entry_date).toISODate() ===
                        dateBounds.week.gte
                          .plus({ day: dayOffset - 1 })
                          .toISODate(),
                  )?.value
                }}</pre>
              </div>
              <p v-else class="text-gray-600 text-xs">No entry yet</p>
            </SenpCard>
          </button>
        </div>
      </section>
    </div>
    <!-- <div class="grid md:grid-cols-2 gap-4">
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
    </div> -->
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
                entryDate: state.currentEntry.entryDate,
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
import { DateTime, Info } from "luxon"

const route = useRoute()
const router = useRouter()

const {
  feedState,
  feedPagination,
  stuffTypes,
  dateBounds,
  stuffEntries,
  getStuffTypes,
  getStuffEntries,
  deleteStuffType,
  upsertStuffType,
} = useFeed({ mode: "week", watchDate: true, weekOffset: -1 })

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
    entryDate: undefined as string | undefined,
  },
})

function editStuffType(
  val: typeof state.currentStuffType,
  activeDate: DateTime,
) {
  state.currentStuffType = val
  const matchingEntry = stuffEntries.value?.find(
    (entry) =>
      entry.stuff_type_id === val.id &&
      DateTime.fromISO(entry.entry_date).toISODate() === activeDate.toISODate(),
  )
  state.currentEntry.entryDate =
    activeDate.toISODate() || state.currentEntry.entryDate
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
    router.push(`/feed?date=${date}&mode=week`)
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
