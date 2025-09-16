'use server';
/**
 * @fileOverview Dynamic quiz generation flow.
 *
 * - generateQuiz - A function that generates a quiz based on the provided content.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  content: z.string().describe('The content to generate a quiz from.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z.string().describe('A JSON string of an array of 10 quiz questions. Each question must have an id, topic, question, a type of "mcq", an array of 4 options, and an answer.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert in generating quizzes from content.

  Given the following content, generate a quiz with exactly 10 multiple-choice questions.
  Each question must be a JSON object with the following properties: "id" (a unique number), "topic" (string), "question" (string), "type" (must be "mcq"), "options" (an array of 4 strings), and "answer" (a string that is one of the options).
  Return the quiz as a JSON string representing an array of these 10 question objects.

  Content: {{{content}}}`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
