<template>
  <div class="grid gap-4">
    <h1 class="text-xl">Profile</h1>
    <form class="grid text-left" @submit.prevent="updateProfile">
      <SenpCard>
        <label
          class="grid gap-1 lg:grid-cols-[15ch,minmax(0px,1fr)] lg:gap-2 lg:items-center"
        >
          <p class="text-sm text-gray-50">Avatar</p>
          <SupabaseAvatar v-model:path="avatarPath" @upload="updateProfile" />
        </label>
        <SenpTextInput
          id="email"
          label="Email"
          type="text"
          :classes="{
            wrapper: {
              extend:
                'lg:grid-cols-[15ch,minmax(0px,1fr)] lg:gap-2 lg:items-center',
            },
            input: {
              extend: 'cursor-not-allowed opacity-70',
            },
          }"
          :model-value="user?.email || ''"
          disabled
        />

        <SenpTextInput
          id="username"
          v-model="username"
          :classes="{
            wrapper: {
              extend:
                'lg:grid-cols-[15ch,minmax(0px,1fr)] lg:gap-2 lg:items-center',
            },
          }"
          label="Username"
          type="text"
        />

        <SenpTextInput
          id="bio"
          v-model="bio"
          multiline
          :classes="{
            wrapper: {
              extend:
                'lg:grid-cols-[15ch,minmax(0px,1fr)] lg:gap-2 lg:items-center',
            },
          }"
          label="Bio"
          type="url"
        />
        <div
          class="grid grid-cols-2 gap-4 items-center lg:ml-[calc(15ch+0.5rem)]"
        >
          <SenpButton
            :classes="{ button: 'w-full' }"
            type="submit"
            :loading="loading"
            @click="updateProfile"
          >
            Update
          </SenpButton>

          <SenpButton
            :classes="{ button: 'w-full' }"
            intent="outline"
            type="submit"
            :loading="loading"
            @click="signOut"
          >
            Sign Out
          </SenpButton>
        </div>
      </SenpCard>
    </form>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()

const loading = ref(true)
const username = ref("")
const bio = ref("")
const avatarPath = ref("")

loading.value = true
const user = useSupabaseUser()

const { data } = await supabase
  .from("profiles")
  .select(`username, bio, avatar_url`)
  .eq("id", user.value?.id || -1)
  .single()

if (data) {
  username.value = data.username || ""
  bio.value = data.bio || ""
  avatarPath.value = data.avatar_url || ""
}

loading.value = false

async function updateProfile() {
  try {
    loading.value = true
    const user = useSupabaseUser()

    const updates = {
      id: user.value?.id || -1,
      username: username.value,
      bio: bio.value,
      avatar_url: avatarPath.value,
      updated_at: new Date(),
    }

    const { error } = await supabase.from("profiles").upsert(updates, {
      returning: "minimal", // Don't return the value after inserting
    })
    if (error) throw error
  } catch (error: any) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
  } catch (error: any) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>
