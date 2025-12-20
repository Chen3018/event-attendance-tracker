import {
    Card,
    CardContent,
    CardFooter,
    CardAction,
} from "@/components/ui/card"
import { Button } from "./ui/button"

import { Link } from "react-router-dom"

export function AuthPromptCard( { text }: { text: string } ) {
    return (
        <Card className="w-full max-w-2xs justify-center">
            <CardContent>{text}</CardContent>

            <CardFooter>
                <CardAction className="w-full space-x-2">
                    <Button variant="secondary" asChild>
                        <Link to="/login">Login</Link>
                    </Button>

                    <Button asChild>
                        <Link to="/sign-up">Sign Up</Link>
                    </Button>
                </CardAction>
            </CardFooter>
        </Card>
    )
}