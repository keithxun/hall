import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        startTime: z.date(),
        endTime: z.date(),
        description: z.string(),
        signUpLink: z.string().url(),
        bookingId: z.number().optional(),
        // optional array for user to include other organisers
        organiserIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) throw new Error("User not authenticated");
      const organisers = Array.from(
        new Set([ctx.auth.userId, ...(input.organiserIds ?? [])]),
      );
      const event = await ctx.db.event.create({
        data: {
          startTime: input.startTime,
          endTime: input.endTime,
          description: input.description,
          signUpLink: input.signUpLink,
          bookingId: input.bookingId,
          organiserIds: organisers,
        },
      });
      return event;
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      // Fetch the event to verify that the user is an organiser.
      const event = await ctx.db.event.findUnique({
        where: { id: input },
      });
      if (!event) {
        throw new Error("Event not found");
      }
      if (!event.organiserIds.includes(ctx.auth.userId!)) {
        throw new Error("Not authorized to delete this event");
      }
      const deletedEvent = await ctx.db.event.delete({
        where: { id: input },
      });
      return deletedEvent;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        description: z.string().optional(),
        signUpLink: z.string().url().optional(),
        bookingId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the event exists and that the user is one of its organisers.
      const event = await ctx.db.event.findUnique({
        where: { id: input.id },
      });
      if (!event) {
        throw new Error("Event not found");
      }
      if (!event.organiserIds.includes(ctx.auth.userId!)) {
        throw new Error("Not authorized to update this event");
      }
      const updatedEvent = await ctx.db.event.update({
        where: { id: input.id },
        data: {
          startTime: input.startTime,
          endTime: input.endTime,
          description: input.description,
          signUpLink: input.signUpLink,
          bookingId: input.bookingId,
        },
      });
      return updatedEvent;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.event.findMany();
  }),
});
