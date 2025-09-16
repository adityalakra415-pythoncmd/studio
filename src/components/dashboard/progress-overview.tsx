"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { progressData } from "@/lib/placeholder-data";

const chartConfig = {
  mastery: {
    label: "Mastery",
    color: "hsl(var(--primary))",
  },
};

export function ProgressOverview() {
  const totalMastery = progressData.reduce((acc, item) => acc + item.mastery, 0);
  const averageMastery = Math.round(totalMastery / progressData.length);
  const topicsMastered = progressData.filter(item => item.mastery >= 80).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mastery Dashboard</CardTitle>
        <CardDescription>Your progress across all topics.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Mastery</CardDescription>
              <CardTitle className="text-4xl text-primary">{averageMastery}%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Topics Mastered</CardDescription>
              <CardTitle className="text-4xl">{topicsMastered}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Study Streak</CardDescription>
              <CardTitle className="text-4xl">12 Days</CardTitle>
            </CardHeader>
          </Card>
        </div>
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <BarChart accessibilityLayer data={progressData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="topic"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
             <Tooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="mastery" fill="var(--color-mastery)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
