<template>
  <div class="grid gap-4">
    <div>
      <h1 class="text-xl">{{ new Date().toDateString() }}</h1>
      <p class="text-xs text-gray-500">
        {{ new Date().toISOString().split("T")[0] }}
      </p>
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
const supabase = useSupabaseClient()

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
      console.log({ data: res.data })
      data.value = res.data
    }
  },
)
loadStuffTypes()

const { exec: loadStuffEntries, loading: stuffEntriesLoading } = useLoading(
  async () => {
    const res = await supabase
      .from("stuff_entry")
      .select(
        `id, user_id, stuff_type_id, value, inserted_at, entry_date, updated_at`,
      )
      .eq("user_id", user.value?.id || "-1")
      .filter("entry_date", "eq", new Date().toISOString().split("T")[0])

    if (res.data) {
      console.log({ data: res.data })
      entries.value = res.data
    }
  },
)
loadStuffEntries()

loading.value = false

function addStuffType() {
  currentStuffType.value = {
    id: undefined,
    title: "",
    description: "",
    datatype: "text",
    enabled: true,
  }
  modalUp.value = true
}

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
      entry_date: new Date().toISOString().split("T")[0],

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
</script>
