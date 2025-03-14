import { PrismaClient } from "@prisma/client";
import facilitiesData from "./data/facilities.json";
import ccasData from "./data/ccas.json";

const prisma = new PrismaClient();

// Sample Clerk user IDs
const clerkUserDiana = "user_2uAh5MZWWY8eh52E6WbaNyFjeLD";
const clerkUserEvan = "user_2uAyDzL3HnB3PUoTgJ7BtwZBSui";

async function clearOldData() {
  // Delete child records first if there are foreign key constraints
  await prisma.booking.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.facility.deleteMany({});
  await prisma.cCA.deleteMany({});
}

async function main() {
  // Clear past data
  await clearOldData();

  // --- Seed Facilities from facilities.json ---
  const facilities = [];
  for (const facility of facilitiesData) {
    // Map the file's keys to our model's fields:
    // facilityName -> name, facilityLocation -> location.
    const created = await prisma.facility.upsert({
      where: { name: facility.name },
      update: {},
      create: {
        name: facility.name,
        location: facility.location,
      },
    });
    facilities.push(created);
  }

  // --- Seed CCAs from ccas.json ---
  const ccas = [];
  for (const cca of ccasData) {
    const createdCCA = await prisma.cCA.upsert({
      where: { name: cca.name },
      update: {},
      create: {
        name: cca.name,
        category: cca.category,
      },
    });
    ccas.push(createdCCA);
  }

  // --- Create Sample Bookings ---
  // For sample purposes, we'll select a facility from the seeded list.
  // For example, pick "Main Area (UL)" if available, else the first facility.
  if (facilities.length === 0) {
    throw new Error("No facilities available for creating sample bookings");
  }

  const mainArea =
    facilities.find((f) => f.name === "Main Area (UL)") ?? facilities[0];

  if (!mainArea) {
    throw new Error("Could not find a valid facility for booking");
  }

  const booking1 = await prisma.booking.create({
    data: {
      startTime: new Date("2025-04-01T10:00:00.000Z"),
      endTime: new Date("2025-04-01T11:00:00.000Z"),
      userId: clerkUserDiana,
      facilityId: mainArea.id,
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      startTime: new Date("2025-04-01T12:00:00.000Z"),
      endTime: new Date("2025-04-01T13:00:00.000Z"),
      userId: clerkUserEvan,
      facilityId: mainArea.id,
    },
  });

  // --- Create Sample Events ---
  // Event 1: An event with an associated booking.
  const event1 = await prisma.event.create({
    data: {
      startTime: new Date("2025-04-01T10:00:00.000Z"),
      endTime: new Date("2025-04-01T11:00:00.000Z"),
      description: "Welcome Event for New Residents",
      signUpLink: "http://example.com/event1",
      bookingId: booking1.id,
      organiserIds: [clerkUserDiana],
    },
  });

  // Event 2: Another event with a booking.
  const event2 = await prisma.event.create({
    data: {
      startTime: new Date("2025-04-01T12:00:00.000Z"),
      endTime: new Date("2025-04-01T13:00:00.000Z"),
      description: "Fitness Workshop",
      signUpLink: "http://example.com/event2",
      bookingId: booking2.id,
      organiserIds: [clerkUserEvan],
    },
  });

  // Event 3: A personal event without a booking.
  const event3 = await prisma.event.create({
    data: {
      startTime: new Date("2025-04-03T14:00:00.000Z"),
      endTime: new Date("2025-04-03T15:00:00.000Z"),
      description: "Social Gathering at Upper Lounge",
      signUpLink: "http://example.com/event3",
      organiserIds: [clerkUserDiana],
    },
  });

  console.log({
    facilities,
    ccas,
    bookings: [booking1, booking2],
    events: [event1, event2, event3],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
