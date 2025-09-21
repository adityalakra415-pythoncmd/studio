import {NextRequest, NextResponse} from 'next/server';
import {liveTranslate} from '@/ai/flows/ai-live-translate';

export async function POST(req: NextRequest) {
  try {
    const {content, targetLanguage} = await req.json();
    const result = await liveTranslate({content, targetLanguage});
    return NextResponse.json(result);
  } catch (error) {
    console.error('API live-translate error:', error);
    return NextResponse.json(
      {error: 'Failed to translate content.'},
      {status: 500}
    );
  }
}
