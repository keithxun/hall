"use client";

import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";

// ----- Booking Item Component -----
// Updated interface includes the facility object.
interface BookingItemProps {
  booking: {
    id: number;
    userId: string;
    facilityId: number;
    startTime: Date;
    endTime: Date;
    facility?: {
      name: string;
    };
  };
  onUpdate: (
    id: number,
    startTime: Date,
    endTime: Date,
    facilityId: number,
  ) => void;
  onDelete: (id: number) => void;
}

function BookingItem({ booking, onUpdate, onDelete }: BookingItemProps) {
  const { data: username } = api.auth.getUserName.useQuery(booking.userId);

  return (
    <li key={booking.id} className="rounded border p-4">
      <div>
        <strong>Booking #{booking.id}</strong>
        <br />
        User: {username?.name ?? "Loading..."} | Facility:
        {booking.facilityId}
        <br />
        Start: {new Date(booking.startTime).toLocaleString()}
        <br />
        End: {new Date(booking.endTime).toLocaleString()}
      </div>
      <div className="mt-2 flex gap-2">
        <button
          className="rounded bg-green-500 p-2 text-white"
          onClick={() => {
            const newStartVal = prompt(
              "Enter new start time (YYYY-MM-DDTHH:MM)",
              new Date(booking.startTime).toISOString().slice(0, 16),
            );
            const newEndVal = prompt(
              "Enter new end time (YYYY-MM-DDTHH:MM)",
              new Date(booking.endTime).toISOString().slice(0, 16),
            );
            const newFacility = prompt(
              "Enter new facility id",
              booking.facilityId.toString(),
            );
            if (newStartVal && newEndVal && newFacility) {
              onUpdate(
                booking.id,
                new Date(newStartVal),
                new Date(newEndVal),
                parseInt(newFacility, 10),
              );
            }
          }}
        >
          Update
        </button>
        <button
          className="rounded bg-red-500 p-2 text-white"
          onClick={() => {
            if (confirm("Are you sure you want to delete this booking?")) {
              onDelete(booking.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default function BookingsPage() {
  const { user } = useUser();
  const {
    data: bookings,
    isLoading,
    error,
    refetch,
  } = api.booking.getAll.useQuery();

  // Filter bookings to show only those created by the current user.
  const myBookings = bookings?.filter((booking) => booking.userId === user?.id);

  // TRPC mutations for updating and deleting bookings.
  const updateBooking = api.booking.update.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteBooking = api.booking.delete.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) return <p>Loading your bookings...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!myBookings || myBookings.length === 0)
    return <p>You have no current bookings.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">My Bookings</h1>
      <ul className="space-y-4">
        {myBookings.map((booking) => (
          <BookingItem
            key={booking.id}
            booking={booking}
            onUpdate={(id, startTime, endTime, facilityId) =>
              updateBooking.mutate({ id, startTime, endTime, facilityId })
            }
            onDelete={(id) => deleteBooking.mutate({ id })}
          />
        ))}
      </ul>
    </div>
  );
}
