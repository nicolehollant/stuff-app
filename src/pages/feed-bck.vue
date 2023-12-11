<template>
  <div v-if="state.date" class="grid gap-4">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-xl">
          {{ DateTime.fromISO(state.date).toLocaleString(DateTime.DATE_FULL) }}
        </h1>
        <p class="text-xs text-gray-500">
          {{ DateTime.fromISO(state.date).toLocaleString(DateTime.DATE_SHORT) }}
        </p>
      </div>
      <div class="flex items-center -space-x-px">
        <NuxtLink :to="`/feed?date=${pagination.prev}`">
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
        <NuxtLink :to="`/feed?date=${pagination.today}`">
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
        <NuxtLink :to="`/feed?date=${pagination.next}`">
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
    <p v-if="stuffTypesLoading">loading...</p>
    <div class="grid md:grid-cols-2 gap-4">
      <button
        v-for="stuff in data"
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
            v-if="entries?.some((entry) => entry.stuff_type_id === stuff.id)"
            class="flex flex-col gap-4"
          >
            <pre class="whitespace-pre-wrap font-sans">{{
              entries.find((entry) => entry.stuff_type_id === stuff.id)?.value
            }}</pre>
          </div>
          <p v-else>No entry yet</p>
        </SenpCard>
      </button>
    </div>
  </div>
  <SenpDrawer v-model:open="modalUp" :title="currentStuffType.title">
    <div class="flex flex-col gap-4">
      <SenpTextInput
        v-model="currentEntry.value"
        multiline
        rows="10"
        :hint="currentStuffType.description"
      ></SenpTextInput>
      <div class="flex items-center gap-2">
        <SenpButton
          :loading="loading"
          @click="
            addOrUpdateStuffType({
              stuff_type_id: currentStuffType.id!,
              value: currentEntry.value,
              id: currentEntry.id,
            })
          "
          >Save Entry</SenpButton
        >
        <SenpButton
          v-if="currentStuffType.id != null"
          intent="destructive"
          :loading="loading"
          @click="deleteStuffType(currentStuffType.id)"
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
const supabase = useSupabaseClient()
const state = reactive({
  date: null as null | string,
  mode: "day" as "day" | "week" | "month",
})
const pagination = computed(() => {
  const today = DateTime.local().toISODate()
  const current = DateTime.fromISO(state.date || today)
  const prev = current.minus({ day: 1 })
  const next = current.plus({ day: 1 })
  return {
    prev: prev.toISODate(),
    next: next.toISODate(),
    today,
  }
})

const loading = ref(true)
const modalUp = ref(false)
const currentStuffType = ref({
  id: undefined as undefined | number,
  title: "",
  description: "",
  datatype: "text",
  enabled: true,
})
const currentEntry = ref({
  id: undefined as undefined | number,
  value: "",
})
const data = ref<
  | {
      id: number
      title: string
      description: string
      datatype: string
      enabled: boolean
    }[]
  | null
>()
const entries = ref<
  | {
      id: number
      user_id: string
      stuff_type_id: number
      value: string
      inserted_at: string
      entry_date: string
      updated_at: string
    }[]
  | null
>()

loading.value = true
const user = useSupabaseUser()

const { exec: loadStuffTypes, loading: stuffTypesLoading } = useLoading(
  async () => {
    const res = await supabase
      .from("stuff_type")
      .select(`id, title, description, datatype, enabled`)
      .eq("user_id", user.value?.id || "-1")

    if (res.data) {
      data.value = res.data
    }
  },
)

const { exec: loadStuffEntries } = useLoading(async () => {
  const res = await supabase
    .from("stuff_entry")
    .select(
      `id, user_id, stuff_type_id, value, inserted_at, entry_date, updated_at`,
    )
    .eq("user_id", user.value?.id || "-1")
    .filter("entry_date", "eq", state.date)

  if (res.data) {
    entries.value = res.data
  }
})

function editStuffType(val: typeof currentStuffType.value) {
  currentStuffType.value = val
  const matchingEntry = entries.value?.find(
    (entry) => entry.stuff_type_id === val.id,
  )
  if (matchingEntry) {
    currentEntry.value.id = matchingEntry.id
    currentEntry.value.value = matchingEntry.value
  }

  modalUp.value = true
}

async function deleteStuffType(id: number) {
  try {
    loading.value = true
    const { error } = await supabase.from("stuff_type").delete().eq("id", id)
    if (error) throw error
    modalUp.value = false
    loadStuffTypes()
  } catch (error: any) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function addOrUpdateStuffType(params: {
  id?: number
  stuff_type_id: number
  value: string
}) {
  try {
    loading.value = true
    const user = useSupabaseUser()

    const updates = {
      id: params.id,

      stuff_type_id: params.stuff_type_id,
      value: params.value,
      entry_date: state.date,

      user_id: user.value?.id || "-1",
      updated_at: new Date(),
    }

    const { error } = await supabase.from("stuff_entry").upsert(updates, {
      returning: "minimal",
    })
    if (error) throw error
    modalUp.value = false
    loadStuffEntries()
  } catch (error: any) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function load() {
  loading.value = true
  await loadStuffTypes()
  await loadStuffEntries()

  loading.value = false
}

watch(
  () => route.query?.date,
  () => {
    if (route.query?.date) {
      const date = DateTime.fromISO(route.query.date + "")
      state.date = date.toISODate()
      load()
    }
  },
)

onMounted(() => {
  if (!route.query?.date) {
    const date = DateTime.local().toISODate()
    router.push(`/feed?date=${date}`)
    return
  }
  const date = DateTime.fromISO(route.query.date + "")
  state.date = date.toISODate()
  load()
})
</script>
