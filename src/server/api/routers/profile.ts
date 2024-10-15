import {
  createTRPCRouter,
  protectedProcedure,
  roleProtectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUserById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: { id: input },
      });
    }),

  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        phoneNumber: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, firstName, lastName, phoneNumber } = input;
      return await ctx.db.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          phoneNumber,
        },
      });
    }),
});
