
'use server';
/**
 * @fileOverview An AI flow for answering user questions.
 *
 * - askAi - A function that answers a user's question.
 * - AskAiInput - The input type for the askAi function.
 * - AskAiOutput - The return type for the askAi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskAiInputSchema = z.object({
  question: z.string().describe('The user\'s question.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).describe('The conversation history.').optional(),
});
export type AskAiInput = z.infer<typeof AskAiInputSchema>;

const AskAiOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the question.'),
});
export type AskAiOutput = z.infer<typeof AskAiOutputSchema>;

export async function askAi(input: AskAiInput): Promise<AskAiOutput> {
  return askAiFlow(input);
}

const askAiFlow = ai.defineFlow(
  {
    name: 'askAiFlow',
    inputSchema: AskAiInputSchema,
    outputSchema: AskAiOutputSchema,
  },
  async ({question, history}) => {
    const historyMessages = history ? history.map(h => ({
        role: h.role,
        content: [{ text: h.content }],
    })) : [];

    const response = await ai.generate({
      prompt: question,
      history: historyMessages,
    });

    return {
      answer: response.text,
    };
  }
);
