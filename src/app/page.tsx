"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { api } from "~/trpc/react";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export default function LandingPage() {
  const { data: eventsData, isLoading: eventsLoading } =
    api.event.getAll.useQuery();

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  useEffect(() => {
    if (eventsData) {
      const mapped = eventsData.map((event) => ({
        id: event.id.toString(),
        title: event.description,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        allDay: false,
      }));
      setCalendarEvents(mapped);
    }
  }, [eventsData]);

  const handleEventClick = (clickInfo: {
    event: { id: string; title: string; start: Date | null; end: Date | null };
  }) => {
    const event = clickInfo.event;
    if (event.start && event.end) {
      setSelectedEvent({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
      });
    }
  };

  function Modal({
    event,
    onClose,
  }: {
    event: CalendarEvent;
    onClose: () => void;
  }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>
        {/* Modal content */}
        <div className="relative w-11/12 rounded bg-white p-4 text-black shadow-lg">
          <h2 className="mb-2 text-lg font-bold">{event.title}</h2>
          <p className="text-sm">
            {event.start.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {event.end.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          <button
            className="mt-4 w-full rounded bg-green-600 px-3 py-1 text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-extrabold">Welcome to RH App!</h2>
          <p className="max-w-md text-lg">(Insert some intro text here idk)</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              className="rounded bg-white px-6 py-3 font-bold text-blue-900 shadow transition hover:bg-green-100"
              href="/facilities"
            >
              Book Facilities
            </Link>
            <Link
              className="rounded bg-white px-6 py-3 font-bold text-blue-900 shadow transition hover:bg-green-100"
              href="/events"
            >
              Create Event
            </Link>
          </div>

          {/* Calendar Section */}
          <div className="mt-8 w-full">
            <h3 className="mb-4 text-2xl font-semibold">Event Calendar</h3>
            {eventsLoading ? (
              <p>Loading events...</p>
            ) : (
              <div className="rounded bg-white p-2 text-black shadow">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={calendarEvents}
                  eventClick={handleEventClick}
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
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} Raffles Hall Developers. All rights
          reserved.
        </p>
      </footer>

      {/* Modal */}
      {selectedEvent && (
        <Modal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
