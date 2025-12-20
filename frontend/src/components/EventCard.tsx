import {
  Card,
  CardContent,
} from "@/components/ui/card"

export function EventCard({ text }: { text: string}) {
    return (
        <Card className="w-full max-w-2xs">
            <CardContent>{text}</CardContent>
        </Card>
    )
}