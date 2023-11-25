<template>
  <Teleport to="#header-leading">
    <h1 class="text-xl">Settings</h1>
  </Teleport>
  <div v-if="user" class="flex flex-col gap-8">
    <SupabaseAccount />
    <StuffSettings />
  </div>
  <p v-else>loading...</p>
</template>

<script setup lang="ts">
const router = useRouter()
const user = useSupabaseUserCb({
  onInvalidSession() {
    router.push("/login")
  },
})
</script>
