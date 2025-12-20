import { Countdown } from "@/components/Countdown"

import type { EventList } from "@/lib/types";
import { useApi } from "@/hooks/api"

import { useEffect, useState } from "react"

export default function Home() {
  const COUNTDOWN_FROM = "2026-10-01T00:00:00";

  const { apiFetch } = useApi();

  // const data = await apiFetch("/events");

  // let currentEvent = data?.current_event || null
  // let futureEvents = data?.future_events || []
  // let pastEvents = data?.past_events || []

  return (
      <div>
        <h1 className="text-5xl font-extrabold">Event Attendance Tracker</h1>

        <Countdown end_time={COUNTDOWN_FROM} />
      </div>
  )
}
