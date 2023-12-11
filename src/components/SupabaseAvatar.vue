<template>
  <div class="flex items-center gap-2">
    <img v-if="src" :src="src" alt="Avatar" class="w-32 h-32" />
    <div v-else class="w-32 h-32 bg-gray-800 flex items-center justify-center">
      <Icon name="mdi:image" class="w-10 h-10 opacity-50" />
    </div>
    <SenpButton
      leading="mdi:pencil"
      intent="link"
      @click="modalUp = true"
    ></SenpButton>
    <SenpModal v-model:open="modalUp">
      <div class="grid gap-4">
        <p class="text-xl">Change Avatar</p>
        <hr class="border-gray-700/50" />
        <SenpFileInput
          read-as="file"
          @update:model-value="uploadAvatar"
        ></SenpFileInput>
      </div>
    </SenpModal>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  path: string | null | undefined
}>()
const { path } = toRefs(props)

const emit = defineEmits<{
  (event: "update:path", value: string): void
  (event: "upload"): void
}>()

const supabase = useSupabaseClient()

const uploading = ref(false)
const src = ref("")
const modalUp = ref(false)

const downloadImage = async () => {
  try {
    if (!path.value) {
      return
    }
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path.value)
    if (error) throw error
    src.value = URL.createObjectURL(data)
  } catch (error: any) {
    console.error("Error downloading image: ", error.message)
  }
}

const uploadAvatar = async (evtFile: File) => {
  try {
    uploading.value = true

    if (!evtFile) {
      throw new Error("You must select an image to upload.")
    }

    const fileExt = evtFile.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, evtFile)

    if (uploadError) throw uploadError

    emit("update:path", filePath)
    emit("upload")
  } catch (error: any) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}

downloadImage()

watch(
  () => path.value,
  () => {
    if (path.value) {
      downloadImage()
    }
  },
)
</script>
