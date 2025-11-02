import { EventCard } from "@/components/EventCard"

import { useAuth } from "@/context/AuthContext"
import { apiFetch } from "@/lib/api"
import type { EventList } from "@/lib/types"

import { useEffect, useState } from "react"

export default function Events() {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<EventList | null>(null);

  const sample = { id: "1",name: "Sample Event", start_time: "2023-10-01", end_time: "2023-10-01", guest_invited: 100, guest_checked_in: 75 }

  const noCurrentText = "No ongoing event at the moment."
  const loggedOutText = "Login or Sign Up to create new events."
  const noPastText = "No past events available."

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await apiFetch("/events");

        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }

    fetchEvents();
  }, []);

  let currentEvent = events?.current_event || null
  let futureEvents = events?.future_events || []
  let pastEvents = events?.past_events || []

  const isCurrent = currentEvent !== null
  const isPast = pastEvents.length > 0

  return (
    <div className="max-w-[95rem] mx-auto">
      <div className="pt-8 pb-5">
        <h2 className="flex text-3xl font-semibold pb-5">Current Event</h2>
        <div className="flex gap-4 flex-wrap">
          {isCurrent ? <EventCard type={0} event={currentEvent} /> :
            <EventCard text={noCurrentText} event={sample} />}
        </div>
      </div>

      <div className="pt-5 pb-5">
        <h2 className="flex text-3xl font-semibold pb-5">Future Events</h2>
        <div className="flex gap-4 flex-wrap">
          {futureEvents.map((event, index) => (
            <EventCard key={index} type={0} event={event} />
          ))}
          {isAuthenticated ? <EventCard type={1} event={sample} /> :
            <EventCard type={2} text={loggedOutText} event={sample} />}
        </div>
      </div>

      <div className="pt-5 pb-5">
        <h2 className="flex text-3xl font-semibold pb-5">Past Events</h2>
        <div className="flex gap-4 flex-wrap">
          {isPast ? pastEvents.map((event, index) => (
            <EventCard key={index} type={0} event={event} />
          )) :
            <EventCard text={noPastText} event={sample} />}
        </div>
      </div>
    </div>
  )
}
