import { columns } from "@/components/guests/columns";
import { DataTable } from "@/components/guests/data-table";

import { toast } from "sonner";

import type { EventDetails } from "@/lib/types";

import { useApi } from "@/hooks/api";
import { useEffect, useState } from "react";

export default function CheckIn() {
  const { apiFetch } = useApi();

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  async function handleCheckIn(guestName: string){
    await apiFetch(`/checkin/${event?.id}`, {
        method: 'POST',
        body: JSON.stringify({ "name": guestName }),
    }).then(() => {
        toast.success(`${guestName} checked in successfully`);
        fetchHomeContent();
    }).catch((_) => {
        toast.error(`Failed to check in ${guestName}`);
    })
  }

  async function handleRemoveGuest(guestId: string){
    await apiFetch(`/guest/${guestId}`, {
        method: 'DELETE',
    }).then(() => {
        toast.success("Guest removed successfully");
        fetchHomeContent();
    }).catch((_) => {
        toast.error("Failed to remove guest");
    })
  }

  useEffect(() => {
    fetchHomeContent();
  }, []);

  async function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !event) return;

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);

    const formData = new FormData();
    formData.append("photo", file);
  }

  return (
      <div className="p-5">
      { event ? 
        <div>
          <DataTable columns={columns(handleRemoveGuest, handleCheckIn, event?.start_time || "", event?.end_time || "")} data={event?.guestList || []} />

          <input type="file" accept="image/*" capture="environment" onChange={handlePhoto}/>
          <img src={imagePreview || ""} alt="Image Preview" className="mt-4 max-w-xs"/>
        </div>
        :
        <div className="text-3xl">No ongoing event.</div>
      }
      </div>
  )
}
