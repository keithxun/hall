import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  // Public endpoint: returns a greeting that varies based on authentication status
  hello: publicProcedure.query(async ({ ctx }) => {
    if (ctx.auth && ctx.auth.userId) {
      return { greeting: `Hello, user ${ctx.auth.userId}!` };
    }
    return { greeting: "Hello, guest!" };
  }),

  getAuthStatus: protectedProcedure.query(async ({ ctx }) => {
    return {
      userId: ctx.auth.userId,
      message: "You are authenticated",
    };
  }),

  getUserName: publicProcedure.input(z.string()).query(async ({ input }) => {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(input);
    return { name: user.username };
  }),

  getCurrentUserName: protectedProcedure.query(async ({ ctx }) => {
    // If you're using protectedProcedure, you should have a valid user session.
    const targetUserId = ctx.auth.userId;
    if (!targetUserId) {
      throw new Error("No user id available");
    }
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(targetUserId);
    return { name: user.username };
  }),

  // Combined update endpoint to update name, roomNumber, and associated CCAs
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        roomNumber: z.string().optional(),
        ccaIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const targetUserId = ctx.auth.userId;
      if (!targetUserId) {
        throw new Error("No user id available");
      }
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(targetUserId, {
        publicMetadata: {
          // Conditionally update fields based on input, ... is used to add object prop to surrounding object
          ...(input.name !== undefined && { name: input.name }),
          ...(input.roomNumber !== undefined && {
            roomNumber: input.roomNumber,
          }),
          ...(input.ccaIds !== undefined && { ccas: input.ccaIds }),
        },
      });
      return { success: true };
    }),
});
