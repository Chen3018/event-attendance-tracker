import {
    Card,
    CardFooter,
    CardAction,
} from "@/components/ui/card"
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { ChevronDownIcon } from "lucide-react"
import { toast } from 'sonner'

import { fromZonedTime } from 'date-fns-tz'

import { useApi } from '@/hooks/api'
import type { EventCreateRequest } from "@/lib/types";

import { useState } from "react"

export function CreateEventCard( { updateEvents }: { updateEvents: () => void } ) {
    const { apiFetch } = useApi();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [eventName, setEventName] = useState<string>("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [startTime, setStartTime] = useState<string>("22:00");
    const [endTime, setEndTime] = useState<string>("01:00");

    const EST_TZ = 'America/New_York';
    const startYear = new Date().getFullYear();

    function buildDateTime(date: Date, time: string): Date {
        const dateStr = date.toISOString().slice(0, 10);
        const localDateTime = new Date(`${dateStr}T${time}:00`);

        return fromZonedTime(localDateTime, EST_TZ);
    }

    async function handleCreateEvent() {
        if (eventName.trim() === "") {
            toast.error("Please enter an event name.");
            return;

        }

        if (!date) {
            toast.error("Please select a date for the event.");
            return;
        }

        const startDateTime = buildDateTime(date, startTime);

        let endDateTime = buildDateTime(date, endTime);
        if (endDateTime <= startDateTime) {
            endDateTime = new Date(endDateTime.getTime() + 24 * 60 * 60 * 1000);
        }

        const newEvent: EventCreateRequest = {
            name: eventName,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
        };

        await apiFetch("/event", {
            method: "POST",
            body: JSON.stringify(newEvent),
        }).then(() => {
            toast.success("Event created successfully!");
        }).catch((_) => {
            toast.error("Failed to create event. Please try again.");
        });

        setDialogOpen(false);
        if (updateEvents) {
            updateEvents();
        }

        setEventName("");
        setDate(undefined);
        setStartTime("22:00");
        setEndTime("01:00");
    }

    return (
        <Card className="w-full max-w-2xs justify-center">

            <CardFooter>
                <CardAction className="w-full">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild> 
                            <Button className="cursor-pointer">Create New Event</Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Event</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                            </DialogDescription>
                            
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="event-name">Event Name</Label>
                                    <Input id="event-name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="event-date">Event Date</Label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" id="event-date" className="w-1/3 justify-between font-normal">{date ? date.toLocaleDateString() : "Select date"}
                                                <ChevronDownIcon/>
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar mode="single" selected={date} fromYear={startYear} toYear={startYear + 5} captionLayout="dropdown" onSelect={(selectedDate) => {
                                                setDate(selectedDate || undefined);
                                                setOpen(false);
                                            }} />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex gap-3">
                                    <div className="grid gap-3">
                                        <Label htmlFor="event-start-time">Start Time</Label>
                                        <Input id="event-start-time" type="time" step="60" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"/>
                                    </div>

                                    <div className="grid gap-3">
                                        <Label htmlFor="event-end-time">End Time</Label>
                                        <Input id="event-end-time" type="time" step="60" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"/>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Close</Button>
                                </DialogClose>

                                <Button onClick={handleCreateEvent}>Create</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardAction>
            </CardFooter>
        </Card>
    )
}