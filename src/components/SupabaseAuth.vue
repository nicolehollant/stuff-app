<template>
  <div class="space-y-4">
    <h2 class="text-2xl tracking-tight">Sign in to StuffApp</h2>
    <p class="text-gray-400">Sign in via magic link with your email below</p>
  </div>
  <div class="space-y-2">
    <SenpTextInput v-model="email" />
    <SenpButton
      :classes="{ button: 'w-full justify-center' }"
      size="xl"
      :loading="loading"
      intent="outline"
      @click="() => handleLogin()"
    >
      Send Magic Link
    </SenpButton>
  </div>
</template>

<!-- <template>
  <form class="flex-center flex" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <h1 class="header">Supabase + Nuxt 3</h1>
      <p class="description">Sign in via magic link with your email below</p>
      <div>
        <input
          v-model="email"
          class="inputField"
          type="email"
          placeholder="Your email"
        />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading' : 'Send magic link'"
          :disabled="loading"
        />
      </div>
    </div>
  </form>
</template> -->

<script setup lang="ts">
const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref("")

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({ email: email.value })
    if (error) throw error
    alert("Check your email for the login link!")
  } catch (error: any) {
    alert(error.error_description || error.message)
  } finally {
    loading.value = false
  }
}
</script>
