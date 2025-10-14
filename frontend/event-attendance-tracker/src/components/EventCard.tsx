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

export function EventCard({ text = "", event }: { text?: string, event: any }) {

    const navigate = useNavigate();

    if (text == "") {
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
    } else {
        return (
            <Card className="w-full max-w-2xs">
                <CardContent>{text}</CardContent>
            </Card>
        )
    }
}