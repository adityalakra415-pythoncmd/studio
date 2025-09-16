
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { liveTranslate } from "@/ai/flows/ai-live-translate";
import { studyPlanItems, quizQuestions, progressData } from "@/lib/placeholder-data";
import { staticText } from "@/lib/static-text";

interface LanguageContextType {
  targetLanguage: string;
  setTargetLanguage: (language: string) => void;
  translations: any;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [targetLanguage, setTargetLanguage] = useState("english");
  const [translations, setTranslations] = useState<any>(staticText);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const translateContent = useCallback(async (language: string) => {
    if (language === 'english') {
      setTranslations(staticText);
      return;
    }

    setIsTranslating(true);
    try {
      const studyPlanContent = studyPlanItems.map(item => ({ id: item.id, topic: item.topic, summary: item.summary }));
      const quizContent = quizQuestions.map(q => ({ id: q.id, question: q.question, options: q.options, topic: q.topic }));
      const progressDataTopics = progressData.map(item => item.topic);

      const contentToTranslate = {
        ...staticText,
        studyPlanItems: studyPlanContent,
        quizQuestions: quizContent,
        progressData: progressDataTopics,
      };
      
      const result = await liveTranslate({ content: JSON.stringify(contentToTranslate), targetLanguage: language });
      const translated = JSON.parse(result.translatedContent);
      
      const newTranslations: any = {
        ...translated,
        studyPlanItems: {},
        quizQuestions: {},
        progressData: {},
      };

      translated.studyPlanItems.forEach((item: any) => {
        newTranslations.studyPlanItems[item.id] = { topic: item.topic, summary: item.summary };
      });

      translated.quizQuestions.forEach((item: any) => {
        newTranslations.quizQuestions[item.id] = { question: item.question, options: item.options, topic: item.topic };
      });

      progressData.forEach((item, index) => {
        newTranslations.progressData[item.topic] = translated.progressData[index];
      });
      
      setTranslations(newTranslations);

    } catch (error) {
      console.error("Translation failed:", error);
      toast({
        title: "Translation failed",
        description: "Could not translate the page content.",
        variant: "destructive",
      });
      setTranslations(staticText); // Revert to default on error
    } finally {
      setIsTranslating(false);
    }
  }, [toast]);

  useEffect(() => {
    translateContent(targetLanguage);
  }, [targetLanguage, translateContent]);

  const value = {
    targetLanguage,
    setTargetLanguage,
    translations,
    isTranslating,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
