import {NextRequest, NextResponse} from 'next/server';
import {summarizeContent} from '@/ai/flows/ai-summarize-content';

export async function POST(req: NextRequest) {
  try {
    const {content} = await req.json();
    const result = await summarizeContent({content});
    return NextResponse.json(result);
  } catch (error) {
    console.error('API summarize-content error:', error);
    return NextResponse.json(
      {error: 'Failed to summarize content.'},
      {status: 500}
    );
  }
}
