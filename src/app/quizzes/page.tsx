
"use client";

import { useState } from 'react';
import { QuizSection } from '@/components/dashboard/quiz-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { quizQuestions as defaultQuizQuestions, QuizQuestion } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function QuizzesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState<QuizQuestion[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (searchQuery.startsWith('/create ')) {
      const topic = searchQuery.substring(8).trim();
      if (!topic) {
        toast({
          title: "Invalid Topic",
          description: "Please provide a topic to create a quiz for.",
          variant: "destructive",
        });
        return;
      }
      setIsGenerating(true);
      try {
        const response = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: `A quiz about ${topic}` }),
        });
        if (!response.ok) {
          throw new Error('Failed to generate quiz');
        }
        const result = await response.json();
        
        let parsedQuiz = JSON.parse(result.quiz);
        if (typeof parsedQuiz.questions === 'string') {
          parsedQuiz = JSON.parse(parsedQuiz.questions);
        }
        
        const newQuiz = Array.isArray(parsedQuiz) ? parsedQuiz : parsedQuiz.questions || [];
        
        setFilteredQuizzes(newQuiz);
        toast({
          title: "Quiz Generated!",
          description: `A new quiz on "${topic}" has been created for you.`,
        });
      } catch (error) {
        console.error("Quiz generation failed:", error);
        toast({
          title: "Quiz Generation Failed",
          description: "Could not generate a quiz for the specified topic.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    } else {
      if (searchQuery.trim() === '') {
        setFilteredQuizzes(null); // Show all if search is cleared
      } else {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = defaultQuizQuestions.filter(q => q.topic.toLowerCase().includes(lowerCaseQuery));
        setFilteredQuizzes(filtered);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quizzes</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by topic or type '/create <topic>' to generate a new quiz" 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isGenerating}
              />
            </div>
            <Button onClick={handleSearch} disabled={isGenerating} className="mt-2">
              {isGenerating ? 'Generating...' : 'Search / Create'}
            </Button>
          </CardHeader>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <QuizSection preloadedQuiz={filteredQuizzes} key={JSON.stringify(filteredQuizzes)} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
