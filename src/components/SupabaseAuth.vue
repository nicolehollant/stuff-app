<template>
  <div class="space-y-4">
    <h2 class="text-2xl tracking-tight">Sign in to StuffApp</h2>
  </div>
  <div class="space-y-2">
    <SenpTab
      v-slot="{ active }"
      v-model="strategy"
      :classes="{
        optionsWrapper: { extend: 'justify-around w-96' },
        options: { extend: 'w-full' },
      }"
      :options="['Magic Link', 'Verification Code']"
    >
      <template v-if="active === 'Magic Link'">
        <SenpCard class="w-96 !block space-y-2 text-left">
          <SenpTextInput
            v-model="email"
            label="Email"
            placeholder="user@example.com"
          />
          <SenpButton
            :classes="{ button: 'w-full justify-center' }"
            size="xl"
            :loading="handleLogin.loading.value"
            intent="outline"
            @click="() => handleLogin.exec()"
          >
            Send Magic Link
          </SenpButton>
        </SenpCard>
        <p class="w-96 text-gray-400 text-sm">
          Enter your email and follow the magic link you receive to sign in or
          return and enter the verification code
        </p>
      </template>
      <!-- <hr class="border-gray-800 border-dashed" /> -->
      <template v-if="active === 'Verification Code'">
        <SenpCard class="w-96 !block space-y-2 text-left">
          <SenpTextInput
            v-model="email"
            label="Email"
            placeholder="user@example.com"
          />
          <SenpTextInput v-model="token" label="Code" placeholder="518231" />
          <SenpButton
            :classes="{ button: 'w-full justify-center' }"
            size="xl"
            :loading="handleToken.loading.value"
            intent="outline"
            @click="() => handleToken.exec()"
          >
            Verify Code
          </SenpButton>
          <SenpButton
            :classes="{ button: 'w-full justify-center' }"
            size="xl"
            :loading="handleLogin.loading.value"
            intent="ghost"
            @click="() => handleLogin.exec()"
          >
            Resend Code
          </SenpButton>
        </SenpCard>
        <p class="w-96 text-gray-400 text-sm">
          Enter your email and enter the verification code you receive to sign
          in
        </p>
      </template>
    </SenpTab>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()

const strategy = ref("Magic Link")
const email = ref("")
const token = ref("")
const config = useRuntimeConfig()

const router = useRouter()

const getURL = () => {
  let url =
    config.public.SITE_URL ?? // Set this to your site URL in production env.
    config.public.VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/"
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`
  return url
}

const handleLogin = useLoading(async () => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: getURL(),
      },
    })
    if (error) throw error
    alert("Check your email for the login link!")
  } catch (error: any) {
    alert(error.error_description || error.message)
  }
})
const handleToken = useLoading(async () => {
  try {
    if (!email.value) {
      throw new Error("Please enter your email")
    }
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email: email.value,
      token: token.value,
      type: "email",
    })
    console.log({ session })
    if (error) throw error
    router.push("/")
  } catch (error: any) {
    alert(error.error_description || error.message)
  }
})
</script>
