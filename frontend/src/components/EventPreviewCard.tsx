import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardAction,
} from "@/components/ui/card"
import { Button } from "./ui/button"

import type { EventPreview } from "@/lib/types";

import { formatInTimeZone } from "date-fns-tz";

import { useNavigate } from "react-router-dom"

export function EventPreviewCard({ event }: { event: EventPreview }) {
    const navigate = useNavigate();

    const EST = 'America/New_York';
    const time = event.start_time;
    const date = formatInTimeZone(new Date(time), EST, 'MM/dd/yyyy');

    return (
        <Card className="w-full max-w-2xs hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate(`/event/${event.id}`)}>
            <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>{date}</CardDescription>
            </CardHeader>

            <CardContent>
                <p>Guests Invited: {event.guest_invited}</p>
                <p>Guests Checked-In: {event.guest_checked_in}</p>
            </CardContent>

            <CardFooter>
                <CardAction className="w-full">
                    <Button className="cursor-pointer">View Details</Button>
                </CardAction>
            </CardFooter>
        </Card>    
    )
}