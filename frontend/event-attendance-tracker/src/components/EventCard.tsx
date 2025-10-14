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

import { useNavigate } from "react-router-dom"

export function EventCard({ type = -1, text = "", event }: { type?: number, text?: string, event: any }) {

    const navigate = useNavigate();

    if (type == 0) {
        return (
            <Card className="w-full max-w-2xs hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate(`/event/${event.id}`)}>
                <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.date}</CardDescription>
                </CardHeader>

                <CardContent>
                    <p>Guests Invited: {event.invited} </p>
                    <p>Guests Checked-In: {event.checkedIn}</p>
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
                        <Button variant="secondary" className="cursor-pointer">Login</Button>
                        <Button className="cursor-pointer">Sign Up</Button>
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