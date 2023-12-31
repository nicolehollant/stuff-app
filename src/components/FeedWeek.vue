<template>
  <div
    v-if="feedState.date"
    class="relative grid grid-rows-[auto,minmax(0,1fr)] h-full"
  >
    <FeedWeekdays
      mode="week"
      :feed-pagination="feedPagination"
      :date-bounds="dateBounds"
      :feed-state="feedState"
      class="sticky top-16 bg-gray-950/60 backdrop-blur"
    />

    <SafeTeleport to="#header-leading">
      <div class="w-max text-right h-16 flex items-center bg-gray-900/40 px-4">
        <h1 class="text-xl hidden md:inline-block leading-tight">
          <span class="font-black tracking-tight">
            {{ DateTime.fromISO(feedState.date).monthLong }}
          </span>
          <span class="font-light text-gray-200">
            {{ " " + DateTime.fromISO(feedState.date).year }}
          </span>
        </h1>
        <h1 class="md:hidden text-base">
          <span class="font-black tracking-tight">
            {{ DateTime.fromISO(feedState.date).monthShort }}
          </span>
          <span class="font-light text-gray-200">
            {{ " " + DateTime.fromISO(feedState.date).year }}
          </span>
        </h1>
      </div>
    </SafeTeleport>
    <SafeTeleport to="#header-trailing">
      <div class="flex items-center -space-x-px">
        <NuxtLink
          v-slot="{ navigate, href }"
          custom
          :to="`/?date=${feedPagination.prev}&mode=week`"
        >
          <SenpButton
            size="xs"
            :href="href"
            class="h-max"
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
          :to="`/?date=${feedPagination.today}&mode=week`"
        >
          <SenpButton
            size="xs"
            :href="href"
            class="h-max"
            square
            label="Today"
            :classes="{
              button: '!bg-gray-900 border border-gray-800 !rounded-none',
            }"
            intent="secondary"
            @click="navigate"
          />
        </NuxtLink>
        <NuxtLink
          v-slot="{ navigate, href }"
          custom
          :to="`/?date=${feedPagination.next}&mode=week`"
        >
          <SenpButton
            size="xs"
            :href="href"
            class="h-max"
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
    <p v-if="!stuffTypes?.length && getStuffTypes.loading.value">loading...</p>
    <div
      ref="weekContainer"
      class="grid grid-flow-col auto-cols-[100%] md:grid-cols-7 md:w-full h-full overflow-y-hidden overflow-x-auto no-scrollbar edge-mask snap-x snap-mandatory px-8 md:px-12"
    >
      <section
        v-for="dayOffset of 7"
        :key="dayOffset"
        class="snap-center snap-always h-full overflow-hidden w-full"
      >
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
} = useFeed({ mode: "week", watchDate: true, weekOffset: 0 })

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

const weekContainer = ref<HTMLDivElement>()

function useActiveScrollSnapElement(options: {
  container: HTMLElement
  runImmediately?: boolean
  noListener?: boolean
  onScrollSettled?: (params: {
    offsets: {
      offset: number
      element: Element
      index: number
    }[]
    minOffset: {
      offset: number
      element: Element
      index: number
    }
  }) => void
}) {
  // Timer, used to detect whether horizontal scrolling is over
  let timer: NodeJS.Timeout | null = null
  function effect() {
    if (timer) {
      clearTimeout(timer)
    }
    // Renew timer
    timer = setTimeout(() => {
      const offsets = [...options.container.children].map((element, index) => {
        const offset = Math.abs(
          element.getBoundingClientRect().left -
            options.container.getBoundingClientRect().left,
        )
        console.log({ offset, element, index })
        return { offset, element, index }
      })
      const minOffsetDistance = Math.min(...offsets.map((el) => el.offset))
      const minOffset = offsets.find(
        (offset) => offset.offset === minOffsetDistance,
      )!
      if (options?.onScrollSettled) {
        options?.onScrollSettled({ offsets, minOffset })
      }
    }, 100)
  }
  // Scrolling event start
  if (!options?.noListener) {
    options.container.addEventListener("scroll", effect)
  }
  if (options?.runImmediately) {
    nextTick(() => {
      effect()
    })
  }
}

const activeSnapIndex = ref<number | null>(0)

watch(
  () => route.query?.date,
  () => {
    if (!weekContainer.value) {
      return
    }
    useActiveScrollSnapElement({
      container: weekContainer.value!,
      runImmediately: true,
      noListener: true,
      onScrollSettled({ minOffset }) {
        if (!weekContainer.value) {
          return
        }
        const date = DateTime.fromISO(route.query.date + "")
        if (window.innerWidth < 768) {
          activeSnapIndex.value = date.weekday - 1
          if (minOffset.index !== activeSnapIndex.value) {
            weekContainer.value.scrollTo({
              behavior: "smooth",
              left:
                weekContainer.value.scrollLeft +
                [...weekContainer.value.children][
                  activeSnapIndex.value
                ].getBoundingClientRect().left,
            })
          }
        }
      },
    })
  },
)

onMounted(() => {
  if (!route.query?.date) {
    const date = DateTime.local().toISODate()
    router.push(`/?date=${date}&mode=week`)
    return
  }
  const date = DateTime.fromISO(route.query.date + "")
  if (date.isValid) {
    feedState.date = date.toISODate()
  }
  getStuffTypes.exec()
  getStuffEntries.exec()
  useActiveScrollSnapElement({
    container: weekContainer.value!,

    onScrollSettled({ minOffset }) {
      if (window.innerWidth >= 768) {
        activeSnapIndex.value = null
      } else if (
        feedState.date !==
        dateBounds.value.week.gte.plus({ day: minOffset.index }).toISODate()
      ) {
        router.push(
          `/?date=${dateBounds.value.week.gte
            .plus({ day: minOffset.index })
            .toISODate()}&mode=week`,
        )
      }
    },
  })
  if (window.innerWidth < 768 && weekContainer.value) {
    const indexOfActiveDateInWeek = date.weekday - 1
    weekContainer.value.scrollTo({
      behavior: "smooth",
      left: [...weekContainer.value.children][
        indexOfActiveDateInWeek
      ].getBoundingClientRect().left,
    })
  }
})
</script>
