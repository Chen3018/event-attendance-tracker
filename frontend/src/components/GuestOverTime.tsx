import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type { GuestCount } from '@/lib/types'

import { useApi } from '@/hooks/api'
import { useEffect, useState } from 'react';

export function GuestOverTime({ eventId }: { eventId: string }) {
    const { apiFetch } = useApi();

    const [guestCounts, setGuestCounts] = useState<GuestCount[]>([]);

    async function fetchGuestCounts(eventId: string) {
        const data = await apiFetch(`/attendance_log/${eventId}`);
        setGuestCounts(data);
    }

    const chartConfig = {
        count: {
            label: "Guests",
            color: "var(--chart-1)",
        }
    } satisfies ChartConfig

    useEffect(() => {
        if (eventId) {
            fetchGuestCounts(eventId);
        }
    }, [eventId]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Guest Count Over Time</CardTitle>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                <AreaChart
                    accessibilityLayer
                    data={guestCounts}
                    margin={{
                    top: 12,
                    left: 12,
                    right: 12,
                    bottom: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="time"
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 5)}
                    />
                    <YAxis />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <defs>
                    <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                        <stop
                        offset="5%"
                        stopColor="var(--color-count)"
                        stopOpacity={0.8}
                        />
                        <stop
                        offset="95%"
                        stopColor="var(--color-count)"
                        stopOpacity={0.1}
                        />
                    </linearGradient>
                    </defs>
                    <Area
                    dataKey="count"
                    type="monotone"
                    fill="url(#fillCount)"
                    fillOpacity={0.4}
                    stroke="var(--color-count)"
                    stackId="a"
                    />
                </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}