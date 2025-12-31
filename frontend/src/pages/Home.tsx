import { Countdown } from "@/components/Countdown"
import { GuestCounter } from "@/components/GuestCounter"

import type { HomeContent } from "@/lib/types";
import { useApi } from "@/hooks/api"
import { useAuth } from "@/context/AuthContext"

import { useEffect, useState } from "react"

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const { apiFetch } = useApi();
  const { login, updateProfile } = useAuth();

  const [events, setEvents] = useState<HomeContent | null>(null);

  async function fetchHomeContent() {
    try {
      const data = await apiFetch("/home");

      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch home content:", error);
    }
  }

  async function recruiterLogin() {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "email": "recruiter@gmail.com", "password": "12345678" }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Login failed with status ${res.status} ${err}`);
      }
      const data = await res.json();

      login(data.access_token);

      const profile = await apiFetch("/profile");

      updateProfile(profile);
    } catch (error: any) {
      console.error("Recruiter login failed:", error);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      recruiterLogin();
    }
    
    let interval: number | undefined;
    fetchHomeContent();

    function start() {
      interval = setInterval(fetchHomeContent, 5000);
    }

    function stop() {
      clearInterval(interval);
    }

    if (events?.current_event) {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stop();
        } else {
          start();
        }
      });

      start();
    }
    return stop;
  }, []);

  return (
      <div className="flex flex-col min-h-screen">
        <div>
          <h1 className="text-5xl font-extrabold py-2">Event Attendance Tracker</h1>

          { events?.current_event ?
            <div className="p-5">
              <div className="text-3xl">Ongoing event: {events.current_event.name}</div>
              <GuestCounter entered={events.current_event.guest_entered} left={events.current_event.guest_left} />
              <div className="text-3xl">Time left</div>
              <Countdown end_time={events.current_event.end_time} />
            </div> 
            :
            events?.next_event ?
            <div className="p-5">
              <div className="text-3xl">Next event: {events.next_event.name}</div>
              <Countdown end_time={events.next_event.start_time} />
            </div>
            :
            <div className="text-3xl p-5">No events planned, create one in the Events page</div>
          }
        </div>

        <div className="mt-auto">Recruiter version, email: recruiter@gmail.com, password: 12345678</div>
      </div>
  )
}
