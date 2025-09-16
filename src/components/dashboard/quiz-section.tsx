
"use client";

import { useState, useEffect } from "react";
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
import { quizQuestions as defaultQuizQuestions } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useTranslation } from "@/hooks/use-translation";

type QuizQuestion = {
    id: number;
    question: string;
    type: "mcq" | "fib";
    options?: string[];
    answer: string;
    topic: string;
}

interface QuizSectionProps {
  preloadedQuiz?: QuizQuestion[] | null;
  onQuizComplete?: (score: number, total: number) => void;
}

export function QuizSection({ preloadedQuiz, onQuizComplete }: QuizSectionProps) {
  const [quizQuestions, setQuizQuestions] = useState(preloadedQuiz === null ? [] : (preloadedQuiz || defaultQuizQuestions));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const { t } = useTranslation();

  const { translations, isTranslating } = useLanguage();
  
  useEffect(() => {
    if (preloadedQuiz === null) { // Explicitly check for null to show all default quizzes
      setQuizQuestions(defaultQuizQuestions);
    } else if(preloadedQuiz) {
      setQuizQuestions(preloadedQuiz);
    }
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  }, [preloadedQuiz])

  if (quizQuestions.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-10">
          <p>No quiz loaded.</p>
          <p className="text-sm">Use the search bar to find or create a quiz.</p>
        </div>
      );
  }

  const quizTranslations = translations.quizQuestions || {};
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const translatedQuestion = quizTranslations[currentQuestion.id];

  const isDynamicQuiz = !!preloadedQuiz;

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
    if (translatedQuestion && translatedQuestion.options && !isDynamicQuiz) { 
        const translatedIndex = translatedQuestion.options.indexOf(selectedAnswer);
        if (translatedIndex !== -1 && currentQuestion.options) {
            answerToCheck = currentQuestion.options[translatedIndex];
        }
    }

    const correct = answerToCheck === currentQuestion.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

    if (isLastQuestion) {
      const finalScore = isCorrect ? score + 1 : score;
      toast({
        title: t('quiz').quizCompleteTitle,
        description: `You scored ${finalScore} out of ${quizQuestions.length}. ${t('quiz').quizCompleteDescription}`,
      });
      onQuizComplete?.(finalScore, quizQuestions.length);
      setCurrentQuestionIndex(0); // Reset for next time
      setScore(0);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const displayQuestion = isTranslating && !isDynamicQuiz ? '...' : (translatedQuestion?.question || currentQuestion.question);
  const displayTopic = isTranslating && !isDynamicQuiz ? '...' : (translatedQuestion?.topic || currentQuestion.topic);
  const displayOptions = (isDynamicQuiz ? currentQuestion.options : translatedQuestion?.options) || currentQuestion.options;
  
  const originalAnswer = currentQuestion.answer;
  let translatedAnswer = originalAnswer;
  if(!isDynamicQuiz && translatedQuestion?.options && currentQuestion.options) {
    translatedAnswer = translatedQuestion.options[currentQuestion.options.indexOf(originalAnswer)] || originalAnswer;
  }
  
  if (!currentQuestion) {
      return <p>Loading quiz...</p>
  }

  return (
    <Card className="h-full flex flex-col shadow-none border-0">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{t('quiz').title}</CardTitle>
            <CardDescription>{displayTopic}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4 font-medium">{`Question ${currentQuestionIndex + 1}/${quizQuestions.length}: ${displayQuestion}`}</p>
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
          <Button onClick={handleSubmit} disabled={isTranslating || !selectedAnswer}>
            {isTranslating ? t('quiz').translating : t('quiz').submit}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
