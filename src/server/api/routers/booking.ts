import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const bookingRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        startTime: z.date(),
        endTime: z.date(),
        facilityId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.create({
        data: {
          startTime: input.startTime,
          endTime: input.endTime,
          facilityId: input.facilityId,
          userId: ctx.auth.userId!,
        },
      });
      return booking;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Fetch the booking to verify ownership
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
      });
      if (!booking) {
        throw new Error("Booking not found");
      }
      if (booking.userId !== ctx.auth.userId) {
        throw new Error("Not authorized to delete this booking");
      }
      const deletedBooking = await ctx.db.booking.delete({
        where: { id: input.id },
      });
      return deletedBooking;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        facilityId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the booking exists and belongs to the current user
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
      });
      if (!booking) {
        throw new Error("Booking not found");
      }
      if (booking.userId !== ctx.auth.userId) {
        throw new Error("Not authorized to update this booking");
      }
      const updatedBooking = await ctx.db.booking.update({
        where: { id: input.id },
        data: {
          startTime: input.startTime,
          endTime: input.endTime,
          facilityId: input.facilityId,
        },
      });
      return updatedBooking;
    }),

  getMyBookings: protectedProcedure.query(async ({ ctx }) => {
    // No need to check auth actually since this is a protected procedure but type casting wants it -.-
    if (!ctx.auth.userId) throw new Error("User not authenticated");
    return await ctx.db.booking.findMany({
      where: { userId: ctx.auth.userId },
    });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.booking.findMany();
  }),
});
