'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing course content.
 *
 * The flow takes course material as input and returns a concise summary, highlighting key concepts and keywords.
 *
 * @module ai/flows/ai-summarize-content
 * @exports summarizeContent - The main function to trigger the summarization flow.
 * @exports SummarizeContentInput - The input type for the summarizeContent function.
 * @exports SummarizeContentOutput - The output type for the summarizeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the summarizeContent flow
const SummarizeContentInputSchema = z.object({
  content: z
    .string()
    .describe('The course material to summarize. This could be lecture notes, textbook excerpts, or video transcripts.'),
});

// Define the output schema for the summarizeContent flow
const SummarizeContentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the course material.'),
});

export type SummarizeContentInput = z.infer<typeof SummarizeContentInputSchema>;
export type SummarizeContentOutput = z.infer<typeof SummarizeContentOutputSchema>;

// Main function to trigger the summarizeContent flow
export async function summarizeContent(input: SummarizeContentInput): Promise<SummarizeContentOutput> {
  return summarizeContentFlow(input);
}

// Define the prompt for summarizing the content
const summarizeContentPrompt = ai.definePrompt({
  name: 'summarizeContentPrompt',
  input: {schema: SummarizeContentInputSchema},
  output: {schema: SummarizeContentOutputSchema},
  prompt: `You are an AI assistant designed to help students learn by summarizing course content.

  Please provide a concise summary of the following course material, highlighting the most critical concepts and keywords:

  {{content}}
  `,
});

// Define the Genkit flow for summarizing content
const summarizeContentFlow = ai.defineFlow(
  {
    name: 'summarizeContentFlow',
    inputSchema: SummarizeContentInputSchema,
    outputSchema: SummarizeContentOutputSchema,
  },
  async input => {
    const {output} = await summarizeContentPrompt(input);
    return output!;
  }
);
