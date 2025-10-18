import { EventCard } from "@/components/EventCard"

export default function Events() {
  const isLoggedIn = false

  const sample = { id: 1,title: "Sample Event", date: "2023-10-01", invited: 100, checkedIn: 75 }

  const noCurrentText = "No ongoing event at the moment."
  const loggedOutText = "Login or Sign Up to create new events."
  const noPastText = "No past events available."

  let currentEvent = sample
  let futureEvents = [sample, sample, sample]
  let pastEvents = [sample, sample, sample, sample]

  const isCurrent = false
  const isPast = pastEvents.length > 0

  return (
    <div className="max-w-[95rem] mx-auto">
      <div className="pt-8 pb-5">
        <h2 className="flex text-3xl font-semibold pb-5">Current Event</h2>
        <div className="flex gap-4 flex-wrap">
          {isCurrent ? <EventCard type={0} event={sample} /> :
            <EventCard text={noCurrentText} event={currentEvent} />}
        </div>
      </div>

      <div className="pt-5 pb-5">
        <h2 className="flex text-3xl font-semibold pb-5">Future Events</h2>
        <div className="flex gap-4 flex-wrap">
          {futureEvents.map((event, index) => (
            <EventCard key={index} type={0} event={event} />
          ))}
          {isLoggedIn ? <EventCard type={1} event={sample} /> :
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
