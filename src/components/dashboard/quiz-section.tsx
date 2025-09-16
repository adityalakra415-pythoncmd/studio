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

export function QuizSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { toast } = useToast();

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast({
        title: "No answer selected",
        description: "Please choose an answer before submitting.",
        variant: "destructive",
      });
      return;
    }
    const correct = selectedAnswer === currentQuestion.answer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of quiz
      setCurrentQuestionIndex(0); // Loop back
      toast({
        title: "Quiz Complete!",
        description: "Your study plan will be adjusted based on your performance.",
      });
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Topic Quiz</CardTitle>
        <CardDescription>{currentQuestion.topic}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4 font-medium">{currentQuestion.question}</p>
        {currentQuestion.type === "mcq" && (
          <RadioGroup
            onValueChange={setSelectedAnswer}
            value={selectedAnswer ?? undefined}
            disabled={showResult}
          >
            {currentQuestion.options?.map((option) => (
              <div
                key={option}
                className={cn(
                  "flex items-center space-x-2 p-3 rounded-md border transition-all",
                  showResult &&
                    option === currentQuestion.answer &&
                    "bg-green-100 dark:bg-green-900 border-green-500",
                  showResult &&
                    option === selectedAnswer &&
                    option !== currentQuestion.answer &&
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
            {isCorrect ? "Correct!" : "Incorrect. The right answer is highlighted."}
          </div>
        )}
        {showResult ? (
          <Button onClick={handleNext}>Next Question</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit</Button>
        )}
      </CardFooter>
    </Card>
  );
}
