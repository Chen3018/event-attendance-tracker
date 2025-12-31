import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { columns } from '@/components/guests/columns'
import type { EventDetails, GuestsInvited } from '@/lib/types'
import { DataTable } from '@/components/guests/data-table'
import { toast } from 'sonner'
import { GuestInvitedPie } from '@/components/GuestInvitedPie'
import { GuestOverTime } from '@/components/GuestOverTime'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog'

import { useApi } from '@/hooks/api'
import { useAuth } from '@/context/AuthContext'

export default function Event() {
  const { apiFetch } = useApi();
  const { isAuthenticated } = useAuth();

  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<EventDetails | null>(null)
  const [guestNames, setGuestNames] = useState<string>("")
  const [guestInvited, setGuestInvited] = useState<GuestsInvited[]>([]);

  async function getList(id: string){
    apiFetch(`/event/${id}`).then(res => {
        setEvent(res);
        
        const newGuestInvited: GuestsInvited[] = [];
        for (const guest of res.guestList) {
            const inviter = guest.invitedBy;
            const existing = newGuestInvited.find((g: GuestsInvited) => g.invitedBy === inviter);
            if (existing) {
                existing.count += 1;
            } else {
                newGuestInvited.push({ invitedBy: inviter, count: 1 });
            }
        }
        setGuestInvited(newGuestInvited);
    });
  }

  useEffect(() => {
    if (id) {
      getList(id);
    }
  }, [id])

  async function handleAddGuests() {
    var namesArray = guestNames.split(',').map(name => name.trim()).filter(name => name.length > 0);

    setGuestNames("");

    var validNames = [];
    var invalidNames = [];
    for (const name of namesArray) {
      if (name.split(' ').length >= 2) {
        validNames.push(name)
      } else {
        invalidNames.push(name)
      }
    }

    if (invalidNames.length > 0) {
      toast.error(`Please provide full names for guests: ${invalidNames.join(', ')}`);
    }

    if (validNames.length === 0) {
      return;
    }
    await apiFetch(`/guest/${id}`, {
      method: 'POST',
      body: JSON.stringify(validNames),
    }).then(() => {
      toast.success(validNames.length + ' guests added successfully', { duration: 1000 });
      getList(id!);
    })
  }

  async function handleRemoveGuest(guestId: string){
    await apiFetch(`/guest/${guestId}`, {
        method: 'DELETE',
    }).then(() => {
        toast.success("Guest removed successfully");
        getList(id!);
    }).catch((_) => {
        toast.error("Failed to remove guest");
    })
  }

  async function handleDeleteEvent(){
    await apiFetch(`/event/${id}`, {
        method: 'DELETE',
    }).then(() => {
        window.location.href = "/events";
        toast.success("Event deleted successfully");
    }).catch((_) => {
        toast.error("Failed to delete event");
    })
  }

  async function handleCheckIn(guestName: string){
    await apiFetch(`/checkin/${id}`, {
        method: 'POST',
        body: JSON.stringify({ name: guestName }),
    }).then(() => {
        toast.success(`${guestName} checked in successfully`);
        getList(id!);
    }).catch((_) => {
        toast.error(`Failed to check in ${guestName}`);
    })
  }

  return (
    <div className="max-w-[95rem] mx-auto pt-8">
      <h2 className="flex text-3xl font-semibold pb-5">{event?.name}</h2>

      <div className='flex justify-between'>
        <Sheet>
          <SheetTrigger asChild className='flex cursor-pointer mb-4'>
            <Button size="lg">Add guests</Button>
          </SheetTrigger>

          {isAuthenticated ?
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Adding Guests</SheetTitle>
              <SheetDescription>
                Please add the full names of the guests, as shown on their ID (school or state), you would like to invite to this event. Separate multiple names with commas.
              </SheetDescription>
            </SheetHeader>

            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="grid gap-3">
                <Label htmlFor="guest_names">Guests</Label>
                <Textarea id="guest_names" value={guestNames} onChange={(e) => setGuestNames(e.target.value)} className='resize-none h-32'/>
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" onClick={handleAddGuests}>Submit</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
          :
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Adding Guests</SheetTitle>
              <SheetDescription>
                Please first login or sign up to add guests to this event.
              </SheetDescription>
            </SheetHeader>

            <SheetFooter>
              <Button asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </SheetFooter>
          </SheetContent>
          }
        </Sheet>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="cursor-pointer" size="lg" variant="destructive">Delete event</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All guest data associated with this event will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteEvent}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className='flex'>
        <div className='flex-1 min-w-0'>
          <DataTable columns={columns(handleRemoveGuest, handleCheckIn, event?.start_time || "", event?.end_time || "")} data={event?.guestList || []} />
        </div>
        <div className='flex-1 min-w-0 pl-60 space-y-2'>
          <GuestInvitedPie guestInvited={guestInvited} />
          <GuestOverTime eventId={id || ""} />
        </div>
      </div>
    </div>
  )
}