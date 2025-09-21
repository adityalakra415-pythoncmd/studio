import {NextRequest, NextResponse} from 'next/server';
import {extractTextFromImage} from '@/ai/flows/ai-extract-text-from-image';

export async function POST(req: NextRequest) {
  try {
    const {imageDataUri} = await req.json();
    const result = await extractTextFromImage({imageDataUri});
    return NextResponse.json(result);
  } catch (error) {
    console.error('API extract-text-from-image error:', error);
    return NextResponse.json(
      {error: 'Failed to extract text from image.'},
      {status: 500}
    );
  }
}
