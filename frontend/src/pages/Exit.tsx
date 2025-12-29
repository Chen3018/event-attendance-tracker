import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import type { EventDetails } from "@/lib/types";

import { useApi } from "@/hooks/api";
import { useEffect, useState } from "react";

export default function Exit() {
  const { apiFetch } = useApi();

  const [event, setEvent] = useState<EventDetails | null>(null);

  async function fetchHomeContent() {
    try {
      const data = await apiFetch("/home");
      if (data.current_event) {
        const eventData = await apiFetch(`/event/${data.current_event.id}`);
        setEvent(eventData);
      } else {
        setEvent(null);
      }
    } catch (error) {
      console.error("Failed to fetch home content:", error);
    }
  }

  async function handleIncrementExited(){
    try {
      await apiFetch(`/exit/${event?.id}`, {
        method: 'POST',
      });
      toast.success("Exited count incremented");
      fetchHomeContent();
    } catch (error) {
      toast.error("Failed to increment exited count");
    }
  }

  useEffect(() => {
    fetchHomeContent();
  }, []);

  return (
      <div className="flex gap-2 p-2">
        <div className="text-left text-lg">Exited:</div>
        <Button onClick={handleIncrementExited} size="lg" className="cursor-pointer">+1</Button>
      </div>
  )
}
