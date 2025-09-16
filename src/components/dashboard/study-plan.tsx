"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { studyPlanItems } from "@/lib/placeholder-data";
import { CheckCircle, CircleDashed, Loader } from "lucide-react";

const statusIcons = {
  completed: <CheckCircle className="w-5 h-5 text-green-500" />,
  "in-progress": <Loader className="w-5 h-5 text-blue-500 animate-spin" />,
  "not-started": <CircleDashed className="w-5 h-5 text-muted-foreground" />,
};

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "not-started": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

export function StudyPlan() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Study Plan</CardTitle>
        <CardDescription>
          Your adaptive path to mastering the material.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {studyPlanItems.map((item) => (
            <AccordionItem value={`item-${item.id}`} key={item.id}>
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    {statusIcons[item.status]}
                    <span className="text-left">{item.topic}</span>
                  </div>
                  <Badge variant="outline" className={statusColors[item.status]}>
                    {item.status.replace("-", " ")}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  {item.summary}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
