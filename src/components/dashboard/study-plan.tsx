
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
import { Button } from "@/components/ui/button";
import { CheckCircle, CircleDashed, Loader, BookOpen } from "lucide-react";
import Link from 'next/link';
import { useLanguage } from "@/context/language-context";
import { useTranslation } from "@/hooks/use-translation";
import { useStudyPlan } from "@/context/study-plan-context";

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
  const { translations, isTranslating } = useLanguage();
  const { t } = useTranslation();
  const { plan: studyPlanItems } = useStudyPlan();
  const studyPlanTranslations = translations.studyPlanItems || {};

  const getStatusLabel = (status: 'completed' | 'in-progress' | 'not-started') => {
    return t('studyPlan').status[status].replace("-", " ");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('studyPlan').title}</CardTitle>
        <CardDescription>
          {t('studyPlan').description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {studyPlanItems.map((item) => (
            <AccordionItem value={`item-${item.id}`} key={item.id}>
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 text-left">
                    {statusIcons[item.status]}
                    <span>
                      {isTranslating ? '...' : (studyPlanTranslations[item.id]?.topic || item.topic)}
                    </span>
                  </div>
                  <Badge variant="outline" className={statusColors[item.status]}>
                    {isTranslating ? '...' : getStatusLabel(item.status)}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {isTranslating ? '...' : (studyPlanTranslations[item.id]?.summary || item.summary)}
                  </p>
                  <Link href={`/study/${item.id}`} passHref>
                    <Button>
                      <BookOpen className="mr-2" />
                      {t('studyPlan').studyTopic}
                    </Button>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
