import { AuthPromptCard } from "@/components/AuthPromptCard"
import { CreateEventCard } from "@/components/CreateEventCard"
import { EventCard } from "@/components/EventCard"
import { EventPreviewCard } from "@/components/EventPreviewCard"

import { useAuth } from "@/context/AuthContext"
import { useApi } from "@/hooks/api"
import type { EventList } from "@/lib/types"

import { useEffect, useState } from "react"

export default function Events() {
  const { isAuthenticated } = useAuth();
  const { apiFetch } = useApi();
  
  const [events, setEvents] = useState<EventList | null>(null);

  const noCurrentText = "No ongoing event at the moment."
  const loggedOutText = "Login or Sign Up to create new events."
  const noPastText = "No past events available."

  async function fetchEvents() {
    try {
      const data = await apiFetch("/events");

      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  }

  useEffect(() => {
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
          {isCurrent ? <EventPreviewCard event={currentEvent} /> :
            <EventCard text={noCurrentText} />}
        </div>
      </div>

      <div className="pt-5 pb-5">
        <h2 className="flex text-3xl font-semibold pb-5">Future Events</h2>
        <div className="flex gap-4 flex-wrap">
          {futureEvents.map((event, index) => (
            <EventPreviewCard key={index} event={event} />
          ))}
          {isAuthenticated ? <CreateEventCard updateEvents={fetchEvents} /> :
            <AuthPromptCard text={loggedOutText} />}
        </div>
      </div>

      <div className="pt-5 pb-5">
        <h2 className="flex text-3xl font-semibold pb-5">Past Events</h2>
        <div className="flex gap-4 flex-wrap">
          {isPast ? pastEvents.map((event, index) => (
            <EventPreviewCard key={index} event={event} />
          )) :
            <EventCard text={noPastText} />}
        </div>
      </div>
    </div>
  )
}
