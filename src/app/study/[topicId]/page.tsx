
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Loader, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { useStudyPlan } from "@/context/study-plan-context";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { QuizSection } from "@/components/dashboard/quiz-section";
import { QuizQuestion, StudyPlanItem } from "@/lib/placeholder-data";
import { askAi } from "@/ai/flows/ai-ask-ai";
import { generateQuiz } from "@/ai/ai-dynamic-quiz-generation";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function StudyTopicPage() {
  const params = useParams();
  const router = useRouter();
  const { topicId } = params;
  const { t } = useTranslation();
  const { toast } = useToast();
  const { plan: studyPlanItems, updateTopicStatus } = useStudyPlan();

  const [topic, setTopic] = useState<StudyPlanItem | undefined>(undefined);
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[] | null>(null);
  
  useEffect(() => {
    const currentTopic = studyPlanItems.find(item => item.id.toString() === topicId);
    setTopic(currentTopic);
    if (currentTopic && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hello! Let's dive into **${currentTopic.topic}**. What would you like to know? Ask me anything to prepare for your quiz.`
      }]);
    }
  }, [topicId, studyPlanItems, messages.length]);


  if (!topic) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen-xl mx-auto">
          <p>Topic not found.</p>
          <Link href="/study-plan">
            <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2" />
                {t('studyTopic').back}
            </Button>
          </Link>
        </div>
      </main>
    );
  }
  
  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage: Message = { role: 'user', content: question };
    const currentMessages: Message[] = [...messages, userMessage];
    setMessages(currentMessages);
    setQuestion("");
    setIsLoading(true);

    try {
      const historyForApi = [
        { role: 'assistant', content: `We are studying the topic: ${topic.topic}. The summary is: ${topic.summary}` },
        ...currentMessages.slice(1).map(m => ({ role: m.role, content: m.content.replace(/<[^>]*>?/gm, '') })) // remove html for history
      ] as any[];

      const result = await askAi({ question: question, history: historyForApi });
      
      setMessages([...currentMessages, { role: 'assistant', content: result.answer }]);
    } catch (error) {
      console.error("AI request failed:", error);
      toast({
        title: t('askAi').title,
        description: "Could not get an answer from the AI.",
        variant: "destructive",
      });
      setMessages(messages); // Revert to previous state
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setGeneratedQuiz(null);
    try {
      const conversation = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const quizContent = `Topic: ${topic.topic}\n\nStudy Conversation:\n${conversation}`;
      
      const result = await generateQuiz({ content: quizContent });

      const parsedQuiz = JSON.parse(result.quiz);
      const questions = Array.isArray(parsedQuiz) ? parsedQuiz : parsedQuiz.questions || [];

      setGeneratedQuiz(questions);
      toast({
        title: t('studyTopic').quizReady,
        description: t('studyTopic').startQuiz,
      })

    } catch (error) {
      console.error("Quiz generation failed:", error);
      toast({
        title: "Quiz Generation Failed",
        description: "Could not generate a quiz based on your study session.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };
  
  const handleQuizComplete = (score: number, total: number) => {
    if (score / total >= 0.8) {
      updateTopicStatus(topic.id, 'completed');
      toast({
        title: "Topic Completed!",
        description: `You've mastered ${topic.topic}! Check your study plan.`,
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-500"
      });
      router.push('/study-plan');
    } else {
       toast({
        title: "Keep Studying!",
        description: "You're getting closer. Try reviewing the material and take the quiz again.",
        variant: "destructive"
      });
    }
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto space-y-6">
        <Link href="/study-plan" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2" />
            {t('studyTopic').back}
          </Button>
        </Link>
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>{t('studyTopic').title}: {topic.topic}</CardTitle>
            <CardDescription>{t('studyTopic').description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col gap-4">
            <ScrollArea className="flex-grow h-[400px] pr-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && (
                      <Avatar>
                        <AvatarFallback><Bot /></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`p-3 rounded-lg max-w-xs lg:max-w-sm xl:max-w-md ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm" dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                    </div>
                    {message.role === 'user' && userAvatar && (
                      <Avatar>
                        <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-muted">
                      <Loader className="w-5 h-5 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="relative">
              <Textarea
                placeholder={t('studyTopic').aiPlaceholder}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pr-20"
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button className="w-full" onClick={handleAsk} disabled={isLoading}>
              {isLoading ? t('askAi').asking : t('askAi').ask}
            </Button>
             <Button 
                className="w-full" 
                onClick={handleGenerateQuiz} 
                disabled={isGeneratingQuiz || messages.length <= 1}
                variant="secondary"
             >
              {isGeneratingQuiz ? t('studyTopic').generatingQuiz : t('studyTopic').generateQuiz}
            </Button>
          </CardFooter>
        </Card>

        {generatedQuiz && (
            <Card>
                <CardHeader>
                    <CardTitle>{t('quiz').title}: {topic.topic}</CardTitle>
                </CardHeader>
                <CardContent>
                    <QuizSection preloadedQuiz={generatedQuiz} onQuizComplete={handleQuizComplete} />
                </CardContent>
            </Card>
        )}
      </div>
    </main>
  );
}
