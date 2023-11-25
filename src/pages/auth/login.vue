<template>
  <div class="space-y-4">
    <h2 class="text-2xl tracking-tight">Sign in to Brainstorm</h2>
    <p class="text-gray-400">
      Please continue with one of the following providers
    </p>
  </div>
  <div class="space-y-2">
    <SenpButton
      :classes="{ button: 'w-full justify-center' }"
      leading="simple-icons:auth0"
      size="xl"
      intent="outline"
      @click="() => signIn('auth0')"
    >
      Auth0
    </SenpButton>
    <SenpButton
      :classes="{ button: 'w-full justify-center' }"
      leading="simple-icons:github"
      size="xl"
      intent="outline"
      @click="() => signIn('github')"
    >
      Github
    </SenpButton>
  </div>
  <p class="text-gray-400 text-sm italic">
    If you don't have Github, use Auth0 :)
  </p>
</template>

<script setup lang="ts">
definePageMeta({ auth: false, layout: "auth" })
const { signIn, status } = useSession()
const router = useRouter()
watch(
  () => status.value,
  () => {
    if (status.value === "authenticated") {
      router.replace("/")
    }
  },
  { immediate: true },
)
</script>
