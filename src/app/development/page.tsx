"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

// ----- Booking Item Component -----
interface BookingItemProps {
  booking: {
    id: number;
    userId: string;
    facilityId: number;
    startTime: Date;
    endTime: Date;
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
  // Use getUserName endpoint to display a username instead of raw userId.
  const { data: username } = api.auth.getUserName.useQuery(booking.userId);

  return (
    <li key={booking.id} className="rounded border p-4">
      <div>
        <strong>Booking #{booking.id}</strong>
        <br />
        User: {username?.name ?? "Loading..."} | Facility: {booking.facilityId}
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

// ----- Event Item Component -----
// Note: The Event model now uses startTime and endTime, and does not include a location field.
interface EventItemProps {
  event: {
    id: number;
    startTime: Date;
    endTime: Date;
    description: string;
    signUpLink: string | null;
    organiserIds: string[];
  };
  onUpdate: (
    id: number,
    startTime: Date,
    endTime: Date,
    description: string,
    signUpLink: string,
  ) => void;
  onDelete: (id: number) => void;
}

function EventItem({ event, onUpdate, onDelete }: EventItemProps) {
  // Display the first organiser's name for reference.
  const organiserId = event.organiserIds[0];
  const { data: organiser } = organiserId
    ? api.auth.getUserName.useQuery(organiserId)
    : { data: null };

  return (
    <li key={event.id} className="rounded border p-4">
      <div>
        <strong>Event #{event.id}</strong>
        <br />
        Start: {new Date(event.startTime).toLocaleString()}
        <br />
        End: {new Date(event.endTime).toLocaleString()}
        <br />
        Description: {event.description}
        <br />
        SignUp Link: {event.signUpLink ?? "N/A"}
        <br />
        Organiser: {organiser?.name ?? "Loading..."}
      </div>
      <div className="mt-2 flex gap-2">
        <button
          className="rounded bg-green-500 p-2 text-white"
          onClick={() => {
            const newStartVal = prompt(
              "Enter new start time (YYYY-MM-DDTHH:MM)",
              new Date(event.startTime).toISOString().slice(0, 16),
            );
            const newEndVal = prompt(
              "Enter new end time (YYYY-MM-DDTHH:MM)",
              new Date(event.endTime).toISOString().slice(0, 16),
            );
            const newDescription = prompt(
              "Enter new description",
              event.description,
            );
            const newSignUpLink = prompt(
              "Enter new sign up link",
              event.signUpLink ?? "",
            );
            if (
              newStartVal &&
              newEndVal &&
              newDescription &&
              newSignUpLink !== null
            ) {
              onUpdate(
                event.id,
                new Date(newStartVal),
                new Date(newEndVal),
                newDescription,
                newSignUpLink,
              );
            }
          }}
        >
          Update
        </button>
        <button
          className="rounded bg-red-500 p-2 text-white"
          onClick={() => {
            if (confirm("Are you sure you want to delete this event?")) {
              onDelete(event.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default function DevelopmentPage() {
  const [activeTab, setActiveTab] = useState<"bookings" | "events">("bookings");

  // ----- Bookings Queries & Mutations -----
  const { data: bookings, refetch: refetchBookings } =
    api.booking.getAll.useQuery();
  const createBooking = api.booking.create.useMutation({
    onSuccess: () => refetchBookings(),
  });
  const updateBooking = api.booking.update.useMutation({
    onSuccess: () => refetchBookings(),
  });
  const deleteBooking = api.booking.delete.useMutation({
    onSuccess: () => refetchBookings(),
  });
  const [newBookingStart, setNewBookingStart] = useState("");
  const [newBookingEnd, setNewBookingEnd] = useState("");
  const [newFacilityId, setNewFacilityId] = useState("");

  // ----- Events Queries & Mutations -----
  const { data: events, refetch: refetchEvents } = api.event.getAll.useQuery();
  const createEvent = api.event.create.useMutation({
    onSuccess: () => refetchEvents(),
  });
  const updateEvent = api.event.update.useMutation({
    onSuccess: () => refetchEvents(),
  });
  const deleteEvent = api.event.delete.useMutation({
    onSuccess: () => refetchEvents(),
  });
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSignUpLink, setNewSignUpLink] = useState("");

  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold">Development Dashboard</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-4">
        <button
          className={`rounded px-4 py-2 ${
            activeTab === "bookings" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </button>
        <button
          className={`rounded px-4 py-2 ${
            activeTab === "events" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
      </div>

      {activeTab === "bookings" && (
        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Booking Management</h2>
          {/* Create New Booking */}
          <div className="mb-4 rounded border p-4">
            <h3 className="mb-2 text-lg font-semibold">Create New Booking</h3>
            <div className="flex flex-col gap-2">
              <input
                type="datetime-local"
                value={newBookingStart}
                onChange={(e) => setNewBookingStart(e.target.value)}
                className="border p-2"
                placeholder="Start Time"
              />
              <input
                type="datetime-local"
                value={newBookingEnd}
                onChange={(e) => setNewBookingEnd(e.target.value)}
                className="border p-2"
                placeholder="End Time"
              />
              <input
                type="number"
                placeholder="Facility Id"
                value={newFacilityId}
                onChange={(e) => setNewFacilityId(e.target.value)}
                className="border p-2"
              />
              <button
                className="rounded bg-blue-500 p-2 text-white"
                onClick={() => {
                  if (!newBookingStart || !newBookingEnd || !newFacilityId) {
                    alert("Please fill in all fields");
                    return;
                  }
                  createBooking.mutate({
                    startTime: new Date(newBookingStart),
                    endTime: new Date(newBookingEnd),
                    facilityId: parseInt(newFacilityId, 10),
                  });
                  setNewBookingStart("");
                  setNewBookingEnd("");
                  setNewFacilityId("");
                }}
              >
                Create Booking
              </button>
            </div>
          </div>

          {/* List All Bookings */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">All Bookings</h3>
            {bookings ? (
              <ul className="space-y-4">
                {bookings.map((booking) => (
                  <BookingItem
                    key={booking.id}
                    booking={booking}
                    onUpdate={(id, startTime, endTime, facilityId) => {
                      updateBooking.mutate({
                        id,
                        startTime,
                        endTime,
                        facilityId,
                      });
                    }}
                    onDelete={(id) => {
                      deleteBooking.mutate({ id });
                    }}
                  />
                ))}
              </ul>
            ) : (
              <p>Loading bookings...</p>
            )}
          </div>
        </section>
      )}

      {activeTab === "events" && (
        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Event Management</h2>
          {/* Create New Event */}
          <div className="mb-4 rounded border p-4">
            <h3 className="mb-2 text-lg font-semibold">Create New Event</h3>
            <div className="flex flex-col gap-2">
              <input
                type="datetime-local"
                placeholder="Start Time"
                value={newEventStart}
                onChange={(e) => setNewEventStart(e.target.value)}
                className="border p-2"
              />
              <input
                type="datetime-local"
                placeholder="End Time"
                value={newEventEnd}
                onChange={(e) => setNewEventEnd(e.target.value)}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="border p-2"
              />
              <input
                type="url"
                placeholder="SignUp Link (optional)"
                value={newSignUpLink}
                onChange={(e) => setNewSignUpLink(e.target.value)}
                className="border p-2"
              />
              <button
                className="rounded bg-blue-500 p-2 text-white"
                onClick={() => {
                  if (!newEventStart || !newEventEnd || !newDescription) {
                    alert("Please fill in all required fields");
                    return;
                  }
                  createEvent.mutate({
                    startTime: new Date(newEventStart),
                    endTime: new Date(newEventEnd),
                    description: newDescription,
                    signUpLink: newSignUpLink,
                  });
                  setNewEventStart("");
                  setNewEventEnd("");
                  setNewDescription("");
                  setNewSignUpLink("");
                }}
              >
                Create Event
              </button>
            </div>
          </div>

          {/* List All Events */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">All Events</h3>
            {events ? (
              <ul className="space-y-4">
                {events.map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onUpdate={(
                      id,
                      startTime,
                      endTime,
                      description,
                      signUpLink,
                    ) => {
                      updateEvent.mutate({
                        id,
                        startTime,
                        endTime,
                        description,
                        signUpLink,
                      });
                    }}
                    onDelete={(id) => {
                      deleteEvent.mutate(id);
                    }}
                  />
                ))}
              </ul>
            ) : (
              <p>Loading events...</p>
            )}
          </div>
        </section>
      )}

      <div className="mt-8">
        <Link href="/" className="text-blue-500 underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
