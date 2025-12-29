import { columns } from "@/components/guests/columns";
import { DataTable } from "@/components/guests/data-table";
import { CameraCanvas } from "@/components/CameraCanvas";

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

  function handlePhoto(blob: Blob) {
    const imageUrl = URL.createObjectURL(blob);
    setImagePreview(imageUrl);

    const formData = new FormData();
    formData.append("id_photo", blob, "photo.jpg");

    apiFetch(`/checkin/id/${event?.id}`, {
      method: 'POST',
      body: formData,
    }).then(() => {
      toast.success(`Photo check-in successful`);
      fetchHomeContent();
    }).catch((_) => {
      toast.error(`Photo check-in failed`);
    });
  }

  return (
      <div className="p-5">
      { event ? 
        <div className="flex">
          <div className="flex-1 min-w-0">
            <DataTable columns={columns(handleRemoveGuest, handleCheckIn, event?.start_time || "", event?.end_time || "")} data={event?.guestList || []} />
          </div>
        
          <CameraCanvas onCapture={handlePhoto} />
          {imagePreview && (
            <img src={imagePreview} alt="Captured"/>
          )}
        </div>
        :
        <div className="text-3xl">No ongoing event.</div>
      }
      </div>
  )
}
