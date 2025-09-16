
"use client";

import { useState } from "react";
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
import { studyPlanItems } from "@/lib/placeholder-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { askAi } from "@/ai/flows/ai-ask-ai";
import { generateQuiz } from "@/ai/ai-dynamic-quiz-generation";
import { QuizSection } from "@/components/dashboard/quiz-section";

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

  const topic = studyPlanItems.find(item => item.id.toString() === topicId);
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);

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
  
  const initialMessages: Message[] = [{
      role: 'assistant',
      content: `Hello! Let's dive into **${topic.topic}**. What would you like to know?`
  }];
  
  if (messages.length === 0) {
      setMessages(initialMessages);
  }

  const handleAsk = async () => {
    if (!question.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setQuestion("");
    setIsLoading(true);

    try {
        const fullHistory = [{ role: 'assistant', content: `We are studying the topic: ${topic.topic}. The summary is: ${topic.summary}`}, ...newMessages];
      const result = await askAi({ question, history: fullHistory });
      setMessages([...newMessages, { role: 'assistant', content: result.answer }]);
    } catch (error) {
      console.error("AI request failed:", error);
      toast({
        title: t('askAi').title,
        description: "Could not get an answer from the AI.",
        variant: "destructive",
      });
      setMessages(newMessages); 
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
    try {
      const conversation = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const quizContent = `Topic: ${topic.topic}\n\nStudy Conversation:\n${conversation}`;
      
      const result = await generateQuiz({ content: quizContent });
      const parsedQuiz = JSON.parse(result.quiz);
      setGeneratedQuiz(parsedQuiz);
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
                    <QuizSection preloadedQuiz={generatedQuiz} />
                </CardContent>
            </Card>
        )}
      </div>
    </main>
  );
}
