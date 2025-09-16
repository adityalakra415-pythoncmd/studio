import { StudyPlan } from '@/components/dashboard/study-plan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudyPlanPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Full Study Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <StudyPlan />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
