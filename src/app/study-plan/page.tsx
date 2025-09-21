
'use client';

import { StudyPlan } from '@/components/dashboard/study-plan';
import { AddStudyPlan } from '@/components/dashboard/add-study-plan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudyPlan } from '@/context/study-plan-context';
import { useToast } from '@/hooks/use-toast';
import { StudyPlanItem } from '@/lib/placeholder-data';
import { generatePersonalizedStudyPlan } from '@/ai/ai-personalized-study-plan';


export default function StudyPlanPage() {
    const { addTopics } = useStudyPlan();
    const { toast } = useToast();

    const handleGeneratePlan = async (topic: string) => {
        try {
            const planResult = await generatePersonalizedStudyPlan({
                courseMaterial: `A study plan about ${topic}`,
                quizResults: "No quiz results yet. Generate a beginner-friendly plan.",
            });
            
            const parsedPlan: StudyPlanItem[] = JSON.parse(planResult.studyPlan);
            addTopics(parsedPlan);

            toast({
                title: 'Study Plan Updated',
                description: `New topics for "${topic}" have been added to your plan.`,
            });
            return true;
        } catch (error) {
            console.error("Study plan generation failed:", error);
            toast({
                title: "Generation Failed",
                description: "Could not generate a study plan for the specified topic.",
                variant: "destructive",
            });
            return false;
        }
    };

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-xl mx-auto space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Full Study Plan</CardTitle>
                        <AddStudyPlan onGenerate={handleGeneratePlan} />
                    </CardHeader>
                    <CardContent>
                        <StudyPlan />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
