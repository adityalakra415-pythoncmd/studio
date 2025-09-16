
"use client";

import { ProgressOverview } from '@/components/dashboard/progress-overview';
import { ContentUpload } from '@/components/dashboard/content-upload';
import { StudyPlan } from '@/components/dashboard/study-plan';
import { QuizSection } from '@/components/dashboard/quiz-section';

export default function DashboardPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-screen-xl grid-cols-1 gap-6 mx-auto lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ProgressOverview />
        </div>
        <div className="lg:col-span-4">
          <ContentUpload />
        </div>
        <div className="lg:col-span-7">
          <StudyPlan />
        </div>
        <div className="lg:col-span-5">
          <QuizSection />
        </div>
      </div>
    </main>
  );
}
