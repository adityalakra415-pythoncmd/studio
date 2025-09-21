import {NextRequest, NextResponse} from 'next/server';
import {generateQuiz} from '@/ai/ai-dynamic-quiz-generation';

export async function POST(req: NextRequest) {
  try {
    const {content} = await req.json();
    const result = await generateQuiz({content});
    return NextResponse.json(result);
  } catch (error) {
    console.error('API generate-quiz error:', error);
    return NextResponse.json(
      {error: 'Failed to generate quiz.'},
      {status: 500}
    );
  }
}
