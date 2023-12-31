import type { User } from "@supabase/gotrue-js"

export function useSupabaseUserCb(
  params?: Partial<{
    onValidSession: (user: User) => void
    onInvalidSession: () => void
    onSettled: (() => void) | null | undefined
  }>,
) {
  const supabase = useSupabaseClient()
  const user = useState<User | null>("supabase_user", () => null)
  supabase?.auth
    .getSession()
    .then(({ data: { session } }) => {
      if (session) {
        if (JSON.stringify(user.value) !== JSON.stringify(session.user)) {
          user.value = session.user
          params?.onValidSession?.(user.value)
        }
      } else {
        user.value = null
        params?.onInvalidSession?.()
      }
    })
    .finally(params?.onSettled)
  return user
}

export function useSupabaseAvatar(
  initialValues?: Partial<{
    avatarPath: string
    username: string
    src: string
  }>,
) {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const avatar = reactive({
    avatarPath: initialValues?.avatarPath ?? "",
    username: initialValues?.username ?? "",
    src: initialValues?.src ?? "",
  })

  async function getUser() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user.value?.id || -1)
        .single()
      if (error) throw error
      avatar.avatarPath = data.avatar_url
      avatar.username = data.username
      return avatar
    } catch (error: any) {
      console.error("Error getting user: ", error.message)
      return avatar
    }
  }

  async function downloadImage(getUserForEmptyPath = true) {
    try {
      if (!avatar.avatarPath && getUserForEmptyPath) {
        await getUser()
      }
      if (!avatar.avatarPath) {
        return
      }
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(avatar.avatarPath)
      if (error) throw error
      avatar.src = URL.createObjectURL(data)
      return avatar
    } catch (error: any) {
      console.error("Error downloading image: ", error.message)
      return avatar
    }
  }

  return {
    getUser,
    downloadImage,
    avatar,
  }
}
