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
import { CheckCircle, XCircle, Languages } from "lucide-react";
import { liveTranslate } from "@/ai/flows/ai-live-translate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const targetLanguages = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "odia", label: "Odia" },
  { value: "bengali", label: "Bengali" },
  { value: "tamil", label: "Tamil" },
  { value: "sanskrit", label: "Sanskrit" },
];

export function QuizSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { toast } = useToast();

  const [translatedQuestion, setTranslatedQuestion] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("english");

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleTranslate = async () => {
    if (targetLanguage === 'english') {
      setTranslatedQuestion(null);
      return;
    }
    setIsTranslating(true);
    try {
      const originalContent = {
        id: currentQuestion.id,
        question: currentQuestion.question,
        options: currentQuestion.options,
        topic: currentQuestion.topic,
      };
      const result = await liveTranslate({ content: JSON.stringify([originalContent]), targetLanguage });
      const translated = JSON.parse(result.translatedContent);
      setTranslatedQuestion(translated[0]);
    } catch (error) {
      console.error("Translation failed:", error);
      toast({
        title: "Translation failed",
        description: "Could not translate the quiz question.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const resetTranslation = () => {
    setTranslatedQuestion(null);
    if (targetLanguage !== 'english') {
        handleTranslate();
    }
  }


  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast({
        title: "No answer selected",
        description: "Please choose an answer before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // The selected answer is in the translated language, we need to find the original english equivalent to check correctness
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
      // End of quiz
      nextIndex = 0; // Loop back
      toast({
        title: "Quiz Complete!",
        description: "Your study plan will be adjusted based on your performance.",
      });
    }
    setCurrentQuestionIndex(nextIndex);
    resetTranslation();
  };
  
  const displayQuestion = translatedQuestion?.question || currentQuestion.question;
  const displayTopic = translatedQuestion?.topic || currentQuestion.topic;
  const displayOptions = translatedQuestion?.options || currentQuestion.options;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
         <div className="flex items-start justify-between">
          <div>
            <CardTitle>Topic Quiz</CardTitle>
            <CardDescription>{isTranslating ? 'Translating...' : displayTopic}</CardDescription>
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
      <CardContent className="flex-grow">
        <p className="mb-4 font-medium">{isTranslating ? 'Translating...' : displayQuestion}</p>
        {currentQuestion.type === "mcq" && (
          <RadioGroup
            onValueChange={setSelectedAnswer}
            value={selectedAnswer ?? undefined}
            disabled={showResult}
          >
            {displayOptions?.map((option) => (
              <div
                key={option}
                className={cn(
                  "flex items-center space-x-2 p-3 rounded-md border transition-all",
                  showResult &&
                    option === (translatedQuestion?.options[currentQuestion.options?.indexOf(currentQuestion.answer) ?? -1] || currentQuestion.answer) &&
                    "bg-green-100 dark:bg-green-900 border-green-500",
                  showResult &&
                    selectedAnswer &&
                    option === selectedAnswer &&
                    selectedAnswer !== (translatedQuestion?.options[currentQuestion.options?.indexOf(currentQuestion.answer) ?? -1] || currentQuestion.answer) &&
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
            {isCorrect ? "Correct!" : `Incorrect. The correct answer is: ${translatedQuestion?.options[currentQuestion.options?.indexOf(currentQuestion.answer) ?? -1] || currentQuestion.answer}`}
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
