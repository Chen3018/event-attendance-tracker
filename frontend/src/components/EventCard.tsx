import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"

import type { EventPreview } from "@/lib/types";

import { useNavigate, Link } from "react-router-dom"

export function EventCard({ type = -1, text = "", event }: { type?: number, text?: string, event: EventPreview }) {

    const navigate = useNavigate();

    if (type == 0) {
        const time = event.start_time;
        const date = new Date(time).toLocaleDateString();
        
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
    } else if (type == 1) {
        return (
            <Card className="w-full max-w-2xs justify-center">

                <CardFooter>
                    <CardAction className="w-full">
                        <Button className="cursor-pointer">Create New Event</Button>
                    </CardAction>
                </CardFooter>
            </Card>
        )
    } else if (type == 2) {
        return (
            <Card className="w-full max-w-2xs justify-center">
                <CardContent>{text}</CardContent>

                <CardFooter>
                    <CardAction className="w-full space-x-2">
                        <Button variant="secondary" className="cursor-pointer">
                            <Link to="/login">Login</Link>
                        </Button>

                        <Button className="cursor-pointer">
                            <Link to="/sign-up">Sign Up</Link>
                        </Button>
                    </CardAction>
                </CardFooter>
            </Card>
        )
    } else {
        return (
            <Card className="w-full max-w-2xs">
                <CardContent>{text}</CardContent>
            </Card>
        )
    }
}