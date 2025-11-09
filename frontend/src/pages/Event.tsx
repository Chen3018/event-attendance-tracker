import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { columns } from '@/components/guests/columns'
import type { EventDetails } from '@/lib/types'
import { DataTable } from '@/components/guests/data-table'
import { toast } from 'sonner'

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

import { useApi } from '@/hooks/api'
import { useAuth } from '@/context/AuthContext'

export default function Event() {
  const { apiFetch } = useApi();
  const { isAuthenticated } = useAuth();

  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<EventDetails | null>(null)
  const [guestNames, setGuestNames] = useState<string>("")

  function getList(id: string): Promise<EventDetails> {
    return apiFetch(`/event/${id}`)
  }

  useEffect(() => {
    if (id) {
      getList(id).then(setEvent)
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
    console.log(validNames);

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
      getList(id!).then(setEvent);
    })
  }

  async function handleRemoveGuest(guestId: string){
    await apiFetch(`/guest/${guestId}`, {
        method: 'DELETE',
    }).then(() => {
        toast.success("Guest removed successfully");
        getList(id!).then(setEvent);
    }).catch((_) => {
        toast.error("Failed to remove guest");
    })
  }

  return (
    <div className="max-w-[95rem] mx-auto pt-8">
      <h2 className="flex text-3xl font-semibold pb-5">{event?.name}</h2>

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

      <DataTable columns={columns(handleRemoveGuest)} data={event?.guestList || []} />
    </div>
  )
}