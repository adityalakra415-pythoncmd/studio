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
import { CheckCircle, CircleDashed, Loader, Languages } from "lucide-react";
import { useState } from "react";
import { liveTranslate } from "@/ai/flows/ai-live-translate";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

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

const targetLanguages = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "odia", label: "Odia" },
  { value: "bengali", label: "Bengali" },
  { value: "tamil", label: "Tamil" },
  { value: "sanskrit", label: "Sanskrit" },
];

export function StudyPlan() {
  const [translatedItems, setTranslatedItems] = useState<Record<number, { topic: string; summary: string }>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("english");
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (targetLanguage === 'english') {
      setTranslatedItems({});
      return;
    }
    setIsTranslating(true);
    try {
      const originalContent = studyPlanItems.map(item => ({ id: item.id, topic: item.topic, summary: item.summary }));
      const result = await liveTranslate({ content: JSON.stringify(originalContent), targetLanguage });
      const translated = JSON.parse(result.translatedContent);
      
      const newTranslatedItems: Record<number, { topic: string; summary: string }> = {};
      translated.forEach((item: any) => {
        newTranslatedItems[item.id] = { topic: item.topic, summary: item.summary };
      });

      setTranslatedItems(newTranslatedItems);
    } catch (error) {
      console.error("Translation failed:", error);
      toast({
        title: "Translation failed",
        description: "Could not translate the study plan.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Personalized Study Plan</CardTitle>
            <CardDescription>
              Your adaptive path to mastering the material.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select onValueChange={setTargetLanguage} defaultValue="english">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {targetLanguages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={handleTranslate} disabled={isTranslating}>
              <Languages className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {studyPlanItems.map((item) => (
            <AccordionItem value={`item-${item.id}`} key={item.id}>
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    {statusIcons[item.status]}
                    <span className="text-left">{translatedItems[item.id]?.topic || item.topic}</span>
                  </div>
                  <Badge variant="outline" className={statusColors[item.status]}>
                    {item.status.replace("-", " ")}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  {isTranslating ? 'Translating...' : (translatedItems[item.id]?.summary || item.summary)}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
