import {NextRequest, NextResponse} from 'next/server';
import {askAi} from '@/ai/flows/ai-ask-ai';

export async function POST(req: NextRequest) {
  try {
    const {question, history} = await req.json();
    const result = await askAi({question, history});
    return NextResponse.json(result);
  } catch (error) {
    console.error('API ask-ai error:', error);
    return NextResponse.json(
      {error: 'Failed to get answer from AI.'},
      {status: 500}
    );
  }
}
