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
