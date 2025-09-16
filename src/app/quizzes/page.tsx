import { QuizSection } from '@/components/dashboard/quiz-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function QuizzesPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <QuizSection />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
