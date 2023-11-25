<template>
  <div class="grid gap-4">
    <h1 class="text-xl">Stuff Types</h1>

    <SenpCard>
      <p v-if="stuffTypesLoading">loading...</p>
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="stuff in data"
          :key="stuff.id"
          class="outline-none focus:outline-none group text-left"
          @click="() => editStuffType(stuff)"
        >
          <SenpCard
            class="border-2 border-gray-800 !bg-gray-800 hover:!bg-gray-800/70 transition duration-200 group-focus:ring"
          >
            <div class="">
              <p class="text-lg">{{ stuff.title }}</p>
              <p class="text-sm text-gray-400">{{ stuff.description }}</p>
            </div>
            <div class="flex items-center gap-2">
              <SenpTag theme="primary">{{ stuff.datatype }}</SenpTag>
              <SenpTag theme="primary">{{
                stuff.enabled ? "enabled" : "disabled"
              }}</SenpTag>
            </div>
          </SenpCard>
        </button>
        <button
          class="outline-none focus:outline-none group text-left h-full"
          @click="() => addStuffType()"
        >
          <SenpCard
            class="border-2 border-gray-800 hover:!bg-gray-800/50 transition duration-200 group-focus:ring h-full items-center justify-center !flex-row text-gray-300"
          >
            <Icon name="mdi:plus" class="text-lg"></Icon>
            <p class="text-base">New Stuff Type</p>
          </SenpCard>
        </button>
      </div>
    </SenpCard>
  </div>
  <SenpDrawer
    v-model:open="modalUp"
    :title="newStuffType.id != null ? 'Edit Stuff Type' : 'New Stuff Type'"
  >
    <div class="flex flex-col gap-4">
      <SenpTextInput v-model="newStuffType.title" label="Title"></SenpTextInput>
      <SenpTextInput
        v-model="newStuffType.description"
        multiline
        label="Description"
      ></SenpTextInput>
      <SenpTextInput
        v-model="newStuffType.datatype"
        label="Datatype"
      ></SenpTextInput>
      <SenpCheckbox
        v-model="newStuffType.enabled"
        label="Enabled"
      ></SenpCheckbox>
      <div class="flex items-center gap-2">
        <SenpButton
          :loading="loading"
          @click="addOrUpdateStuffType(newStuffType)"
          >Save Stuff Type</SenpButton
        >
        <SenpButton
          v-if="newStuffType.id != null"
          intent="destructive"
          :loading="loading"
          @click="deleteStuffType(newStuffType.id)"
          >Delete Stuff Type</SenpButton
        >
      </div>
    </div>
  </SenpDrawer>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()

const loading = ref(true)
const modalUp = ref(false)
const newStuffType = ref({
  id: undefined as undefined | number,
  title: "",
  description: "",
  datatype: "text",
  enabled: true,
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

loading.value = false

function addStuffType() {
  newStuffType.value = {
    id: undefined,
    title: "",
    description: "",
    datatype: "text",
    enabled: true,
  }
  modalUp.value = true
}

function editStuffType(val: typeof newStuffType.value) {
  newStuffType.value = val
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
  title: string
  description: string
  datatype: string
  enabled: boolean
}) {
  try {
    loading.value = true
    const user = useSupabaseUser()

    const updates = {
      id: params.id,
      title: params.title,
      description: params.description,
      datatype: params.datatype,
      enabled: params.enabled,
      user_id: user.value?.id || "-1",
      updated_at: new Date(),
    }

    const { error } = await supabase.from("stuff_type").upsert(updates, {
      returning: "minimal",
    })
    if (error) throw error
    modalUp.value = false
    loadStuffTypes()
  } catch (error: any) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>
