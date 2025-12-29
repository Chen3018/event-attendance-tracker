import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Pie, PieChart } from 'recharts'
import { TrendingUp } from 'lucide-react'

import type { GuestsInvited } from '@/lib/types'
import type { ChartConfig } from '@/components/ui/chart'

export function GuestInvitedPie({ guestInvited }: { guestInvited: GuestsInvited[] }) {
    const chartData = guestInvited.map((item, index) => ({
        name: item.invitedBy,
        value: item.count,
        fill: `var(--chart-${index % 5 + 1})`,
    }));

    const chartConfig = {
        value: { label: "Guests" },
        ...Object.fromEntries(
            chartData.map((item) => [
                item.name,
                { label: item.name, fill: item.fill },
            ])
        ),
    } satisfies ChartConfig

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Number of guests invited</CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
                >
                <PieChart>
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie data={chartData} dataKey="value" nameKey="name" />
                </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}