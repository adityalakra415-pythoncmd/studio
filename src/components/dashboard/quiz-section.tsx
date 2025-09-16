"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { quizQuestions } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useTranslation } from "@/hooks/use-translation";

export function QuizSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const { translations, isTranslating } = useLanguage();
  const quizTranslations = translations.quizQuestions || {};
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const translatedQuestion = quizTranslations[currentQuestion.id];

  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast({
        title: t('quiz').noAnswerTitle,
        description: t('quiz').noAnswerDescription,
        variant: "destructive",
      });
      return;
    }
    
    let answerToCheck = selectedAnswer;
    if (translatedQuestion && translatedQuestion.options) {
        const translatedIndex = translatedQuestion.options.indexOf(selectedAnswer);
        if (translatedIndex !== -1 && currentQuestion.options) {
            answerToCheck = currentQuestion.options[translatedIndex];
        }
    }

    const correct = answerToCheck === currentQuestion.answer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    let nextIndex;
    if (currentQuestionIndex < quizQuestions.length - 1) {
      nextIndex = currentQuestionIndex + 1
    } else {
      nextIndex = 0;
      toast({
        title: t('quiz').quizCompleteTitle,
        description: t('quiz').quizCompleteDescription,
      });
    }
    setCurrentQuestionIndex(nextIndex);
  };
  
  const displayQuestion = isTranslating ? '...' : (translatedQuestion?.question || currentQuestion.question);
  const displayTopic = isTranslating ? '...' : (translatedQuestion?.topic || currentQuestion.topic);
  const displayOptions = translatedQuestion?.options || currentQuestion.options;
  
  const originalAnswer = currentQuestion.answer;
  const translatedAnswer = translatedQuestion?.options[currentQuestion.options?.indexOf(originalAnswer) ?? -1] || originalAnswer;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
         <div className="flex items-start justify-between">
          <div>
            <CardTitle>{t('quiz').title}</CardTitle>
            <CardDescription>{displayTopic}</CardDescription>
          </div>
         </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4 font-medium">{displayQuestion}</p>
        {currentQuestion.type === "mcq" && (
          <RadioGroup
            onValueChange={setSelectedAnswer}
            value={selectedAnswer ?? undefined}
            disabled={showResult || isTranslating}
          >
            {displayOptions?.map((option) => (
              <div
                key={option}
                className={cn(
                  "flex items-center space-x-2 p-3 rounded-md border transition-all",
                  showResult &&
                    option === translatedAnswer &&
                    "bg-green-100 dark:bg-green-900 border-green-500",
                  showResult &&
                    selectedAnswer &&
                    option === selectedAnswer &&
                    selectedAnswer !== translatedAnswer &&
                    "bg-red-100 dark:bg-red-900 border-red-500"
                )}
              >
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        {showResult && (
          <div className={cn(
            "flex items-center gap-2 p-3 rounded-md text-sm font-medium",
            isCorrect ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          )}>
            {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {isCorrect ? t('quiz').correct : `${t('quiz').incorrect} ${translatedAnswer}`}
          </div>
        )}
        {showResult ? (
          <Button onClick={handleNext}>{t('quiz').nextQuestion}</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isTranslating}>
            {isTranslating ? t('quiz').translating : t('quiz').submit}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
