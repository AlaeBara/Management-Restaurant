"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { mois: "Jan", revenus: 12000, dépenses: 9000 },
  { mois: "Fév", revenus: 15000, dépenses: 10000 },
  { mois: "Mar", revenus: 18000, dépenses: 11000 },
  { mois: "Avr", revenus: 14000, dépenses: 12000 },
  { mois: "Mai", revenus: 16000, dépenses: 13000 },
  { mois: "Juin", revenus: 20000, dépenses: 14000 },
];

const chartConfig = {
  revenus: {
    label: "Revenus",
    color: "hsl(var(--chart-1))",
  },
  dépenses: {
    label: "Dépenses",
    color: "hsl(var(--chart-2))",
  },
};

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenus et Dépenses</CardTitle>
        <CardDescription>
          Affichage des revenus et dépenses pour les 6 derniers mois
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mois"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="revenus"
              type="natural"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-2))"
              stackId="a"
            />
            <Area
              dataKey="dépenses"
              type="natural"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-1))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              En hausse de 5.2% ce mois-ci <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Janvier - Juin 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}