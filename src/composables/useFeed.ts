import { DateTime } from "luxon"

export function useFeed(params: {
  mode: "day" | "week" | "month"
  initialDate?: string
  watchDate?: boolean
  weekOffset?: number
}) {
  const route = useRoute()
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const feedState = reactive({
    date: params?.initialDate ?? DateTime.local().toISODate(),
  })

  const feedPagination = computed(() => {
    const today = DateTime.local().toISODate()
    const current = DateTime.fromISO(feedState.date || today)
    const prev = current.minus({ [params.mode]: 1 })
    const next = current.plus({ [params.mode]: 1 })
    return {
      prev: prev.toISODate(),
      next: next.toISODate(),
      today,
      current,
      day: {
        prev: current.minus({ day: 1 }).toISODate(),
        next: current.plus({ day: 1 }).toISODate(),
      },
      week: {
        prev: current.minus({ week: 1 }).toISODate(),
        next: current.plus({ week: 1 }).toISODate(),
      },
      month: {
        prev: current.minus({ month: 1 }).toISODate(),
        next: current.plus({ month: 1 }).toISODate(),
      },
    }
  })

  const dateBounds = computed(() => {
    const current = DateTime.fromISO(feedState.date)
    return {
      day: {
        gte: current.startOf("day"),
        lte: current.endOf("day"),
      },
      week: {
        gte: current.startOf("week").plus({ day: params?.weekOffset ?? 0 }),
        lte: current.endOf("week").plus({ day: params?.weekOffset ?? 0 }),
      },
      month: {
        gte: current.startOf("month"),
        lte: current.endOf("month"),
      },
    }
  })

  const stuffTypes = ref<
    | {
        id: number
        title: string
        description: string
        datatype: string
        enabled: boolean
      }[]
    | null
  >()

  const stuffEntries = ref<
    | {
        id: number
        user_id: string
        stuff_type_id: number
        value: string
        inserted_at: string
        entry_date: string
        updated_at: string
      }[]
    | null
  >()

  const getStuffTypes = useLoading(async () => {
    const res = await supabase
      .from("stuff_type")
      .select(`id, title, description, datatype, enabled`)
      .eq("user_id", user.value?.id || "-1")

    if (res.data) {
      stuffTypes.value = res.data
      return res.data
    }
  })

  // select * from stuff_entry where user_id::text = '34eaa97c-b675-406a-9b6b-0d30168ea513'  and entry_date >= '2023-11-25'  and entry_date < '2023-11-26'
  const getStuffEntries = useLoading(async () => {
    const res = await supabase
      .from("stuff_entry")
      .select(
        `id, user_id, stuff_type_id, value, inserted_at, entry_date, updated_at`,
      )
      .eq("user_id", user.value?.id || "-1")
      .gte("entry_date", dateBounds.value[params.mode].gte.toISODate())
      .lte("entry_date", dateBounds.value[params.mode].lte.toISODate())

    if (res.data) {
      stuffEntries.value = res.data
      return res.data
    }
  })

  const deleteStuffType = useLoading(async (id: number) => {
    const { error } = await supabase.from("stuff_type").delete().eq("id", id)
    if (error) throw error
    getStuffTypes.exec()
  })

  const upsertStuffType = useLoading(
    async (params: {
      id?: number
      stuff_type_id: number
      value: string
      entryDate?: string
    }) => {
      const updates = {
        id: params.id,
        stuff_type_id: params.stuff_type_id,
        value: params.value,
        entry_date: params?.entryDate || feedState.date,
        user_id: user.value?.id || "-1",
        updated_at: new Date(),
      }
      // @ts-expect-error
      const { error } = await supabase.from("stuff_entry").upsert(updates, {
        returning: "minimal",
      })
      if (error) throw error
      getStuffEntries.exec()
    },
  )

  if (params?.watchDate) {
    watch(
      () => route.query?.date,
      async () => {
        if (route.query?.date) {
          const date = DateTime.fromISO(route.query.date + "")
          if (date.isValid) {
            feedState.date = date.toISODate()
            await getStuffTypes.exec()
            await getStuffEntries.exec()
          }
        }
      },
    )
  }

  return {
    feedState,
    feedPagination,
    dateBounds,
    stuffTypes,
    stuffEntries,
    getStuffTypes,
    getStuffEntries,
    deleteStuffType,
    upsertStuffType,
  }
}
