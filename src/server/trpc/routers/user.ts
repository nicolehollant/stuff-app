import { protectedProcedure, router } from "../trpc"

export const userRouter = router({
  /**
   * whoami
   * returns session from context
   */
  whoami: protectedProcedure.query(({ ctx }) => {
    return ctx.session
  }),
})
