import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const facilityRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        location: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const facility = await ctx.db.facility.create({
        data: input,
      });
      return facility;
    }),

  delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const facility = await ctx.db.facility.delete({
      where: { id: input },
    });
    return facility;
  }),

  // Get all facilities without their bookings
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.facility.findMany();
  }),

  // Get all facilities with their associated bookings
  getAllWithBookings: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.facility.findMany({
      include: {
        bookings: true,
      },
    });
  }),

  // Get a specific facility by id along with its bookings
  getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.facility.findUnique({
      where: { id: input },
      include: {
        bookings: true,
      },
    });
  }),
});
