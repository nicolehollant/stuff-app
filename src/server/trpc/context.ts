import { inferAsyncReturnType } from "@trpc/server"
import type { H3Event } from "h3"

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(_event: H3Event) {
  const session = await getServerSession(_event)
  return { session }
}

export type Context = inferAsyncReturnType<typeof createContext>
