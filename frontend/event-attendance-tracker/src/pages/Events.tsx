import { EventCard } from "@/components/EventCard"

export default function Events() {
  const sample = { title: "Sample Event", date: "2023-10-01", invited: 100, checkedIn: 75 }

  const noCurrentText = "No ongoing event at the moment."
  const noFutureText = "No upcoming events scheduled."
  const noPastText = "No past events available."

  const isCurrent = false
  const isFuture = true
  const isPast = true

  let currentEvent = sample
  let futureEvents = [sample, sample, sample]
  let pastEvents = [sample, sample, sample, sample]

  return (
    <div className="max-w-[95rem] mx-auto">
      <div className="pt-8 pb-5">
        <h2 className="flex text-3xl font-semibold pb-5">Current Event</h2>
        <div className="flex gap-4 flex-wrap">
          {isCurrent ? <EventCard event={sample} /> :
            <EventCard text={noCurrentText} event={currentEvent} />}
        </div>
      </div>

      <div className="pt-5 pb-5">
        <h2 className="flex text-3xl font-semibold pb-5">Future Events</h2>
        <div className="flex gap-4 flex-wrap">
          {isFuture ? futureEvents.map((event, index) => (
            <EventCard key={index} event={event} />
          )) :
            <EventCard text={noFutureText} event={sample} />}
        </div>
      </div>

      <div className="pt-5 pb-5">
        <h2 className="flex text-3xl font-semibold pb-5">Past Events</h2>
        <div className="flex gap-4 flex-wrap">
          {isPast ? pastEvents.map((event, index) => (
            <EventCard key={index} event={event} />
          )) :
            <EventCard text={noPastText} event={sample} />}
        </div>
      </div>
    </div>
  )
}
