import Link from "next/link";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
  // Query the booking router to get all bookings
  const bookings = await api.booking.getAll();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Booking Dashboard
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              Total Bookings: {bookings.length}
            </p>
            <ul className="list-disc">
              {bookings.map((booking) => (
                <li key={booking.id}>
                  Booking #{booking.id} by user {booking.userId} for facility{" "}
                  {booking.facilityId} at{" "}
                  {new Date(booking.slot).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/some-other-page"
            className="mt-8 rounded bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            View More Details
          </Link>
        </div>
      </main>
    </HydrateClient>
  );
}
