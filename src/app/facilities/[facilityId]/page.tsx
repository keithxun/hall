"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function FacilityDetailPage() {
  const { facilityId } = useParams();

  const {
    data: facility,
    isLoading,
    error,
  } = api.facility.getById.useQuery(Number(facilityId));

  if (isLoading) return <p>Loading facility details...</p>;
  if (error) return <p>Error loading facility: {error.message}</p>;
  if (!facility) return <p>Facility not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">{facility.name}</h1>
      {facility.location && (
        <p className="mb-4 text-lg">Location: {facility.location}</p>
      )}

      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Bookings</h2>
        {facility.bookings && facility.bookings.length > 0 ? (
          <ul className="space-y-2">
            {facility.bookings.map((booking) => (
              <li key={booking.id} className="rounded border p-2">
                <p>
                  <span className="font-semibold">Start:</span>{" "}
                  {new Date(booking.startTime).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">End:</span>{" "}
                  {new Date(booking.endTime).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings available.</p>
        )}
      </section>

      <Link
        href="/facilities"
        className="inline-block text-blue-600 underline hover:text-blue-800"
      >
        &larr; Back to Facilities Overview
      </Link>
    </div>
  );
}
