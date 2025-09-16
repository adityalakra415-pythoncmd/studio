
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { askAi } from "@/ai/flows/ai-ask-ai";
import { Bot, User, Loader } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AskAi() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');


  const handleAsk = async () => {
    if (!question.trim()) {
      toast({
        title: "Question is empty",
        description: "Please enter a question to ask the AI.",
        variant: "destructive",
      });
      return;
    }

    const newMessages: Message[] = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setQuestion("");
    setIsLoading(true);

    try {
      const result = await askAi({ question, history: newMessages.slice(0, -1) });
      setMessages([...newMessages, { role: 'assistant', content: result.answer }]);
    } catch (error) {
      console.error("AI request failed:", error);
      toast({
        title: "AI request failed",
        description: "Could not get an answer from the AI.",
        variant: "destructive",
      });
      setMessages(newMessages); // Revert to messages before AI response
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

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{t('askAi').title}</CardTitle>
        <CardDescription>{t('askAi').description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <ScrollArea className="flex-grow h-[200px] pr-4">
            <div className="space-y-4">
            {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && (
                        <Avatar>
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                    )}
                    <div className={`p-3 rounded-lg max-w-xs lg:max-w-sm xl:max-w-md ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{message.content}</p>
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
            placeholder={t('askAi').placeholder}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            className="pr-20"
            disabled={isLoading}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleAsk} disabled={isLoading}>
          {isLoading ? t('askAi').asking : t('askAi').ask}
        </Button>
      </CardFooter>
    </Card>
  );
}
