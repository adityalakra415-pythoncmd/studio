'use server';
/**
 * @fileOverview A live translation AI flow for translating UI components.
 *
 * - liveTranslate - A function that handles the text translation process for UI elements.
 * - LiveTranslateInput - The input type for the liveTranslate function.
 * - LiveTranslateOutput - The return type for the liveTranslate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LiveTranslateInputSchema = z.object({
  content: z.string().describe('A JSON string representing the content to be translated. It can be an object or an array of objects.'),
  targetLanguage: z.string().describe('The language to translate the text into.'),
});
export type LiveTranslateInput = z.infer<typeof LiveTranslateInputSchema>;

const LiveTranslateOutputSchema = z.object({
  translatedContent: z.string().describe('The translated content in the same JSON structure as the input.'),
});
export type LiveTranslateOutput = z.infer<typeof LiveTranslateOutputSchema>;

export async function liveTranslate(input: LiveTranslateInput): Promise<LiveTranslateOutput> {
  return liveTranslateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'liveTranslatePrompt',
  input: {schema: LiveTranslateInputSchema},
  output: {schema: LiveTranslateOutputSchema},
  prompt: `You are a translation expert. Translate the provided JSON content to {{{targetLanguage}}}.
It is critical that you maintain the exact same JSON structure, including all keys from the original content. Only translate the string values.

Original Content (JSON):
{{{content}}}

Translated Content (JSON):`,
});

const liveTranslateFlow = ai.defineFlow(
  {
    name: 'liveTranslateFlow',
    inputSchema: LiveTranslateInputSchema,
    outputSchema: LiveTranslateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
