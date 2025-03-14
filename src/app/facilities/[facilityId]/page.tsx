"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { api } from "~/trpc/react";

export default function FacilityDetailPage() {
  const { facilityId } = useParams();
  const {
    data: facility,
    isLoading,
    error,
  } = api.facility.getById.useQuery(Number(facilityId));

  // Map bookings to calendar events:
  // Each event will display "Booking #id" as its title,
  // with start and end times taken from the booking.
  const calendarBookings =
    facility?.bookings.map((booking) => ({
      id: booking.id.toString(),
      title: `Booking #${booking.id}`,
      start: new Date(booking.startTime),
      end: new Date(booking.endTime),
    })) ?? [];

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
        <h2 className="mb-4 text-2xl font-semibold">Bookings Calendar</h2>
        <div className="rounded bg-white p-2 text-black shadow">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarBookings}
            height="auto"
            contentHeight="auto"
            aspectRatio={1.0}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
            headerToolbar={{
              left: "",
              center: "title",
              right: "",
            }}
            footerToolbar={{
              left: "",
              center: "prev,next",
              right: "",
            }}
            handleWindowResize={true}
          />
        </div>
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
