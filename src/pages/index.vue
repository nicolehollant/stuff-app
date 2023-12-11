<template>
  <div class="p-4">
    <div v-if="user" class="flex flex-col gap-8">
      <StuffSettings />
      <SupabaseAccount />
    </div>
    <p v-else>loading...</p>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const user = useSupabaseUserCb({
  onInvalidSession() {
    router.push("/login")
  },
})
</script>
