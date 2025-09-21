import {NextRequest, NextResponse} from 'next/server';
import {generatePersonalizedStudyPlan} from '@/ai/ai-personalized-study-plan';

export async function POST(req: NextRequest) {
  try {
    const {courseMaterial, quizResults} = await req.json();
    const result = await generatePersonalizedStudyPlan({
      courseMaterial,
      quizResults,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('API generate-study-plan error:', error);
    return NextResponse.json(
      {error: 'Failed to generate study plan.'},
      {status: 500}
    );
  }
}
