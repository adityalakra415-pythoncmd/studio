'use server';
/**
 * @fileOverview An AI agent that generates a personalized study plan based on student performance.
 *
 * - generatePersonalizedStudyPlan - A function that generates a personalized study plan.
 * - GeneratePersonalizedStudyPlanInput - The input type for the generatePersonalizedStudyPlan function.
 * - GeneratePersonalizedStudyPlanOutput - The return type for the generatePersonalizedStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedStudyPlanInputSchema = z.object({
  courseMaterial: z
    .string()
    .describe('The course material to generate a study plan for.'),
  quizResults: z
    .string()
    .describe(
      'The quiz results of the student, including topics and scores for each topic.'
    ),
});
export type GeneratePersonalizedStudyPlanInput = z.infer<
  typeof GeneratePersonalizedStudyPlanInputSchema
>;

const GeneratePersonalizedStudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('The personalized study plan.'),
});
export type GeneratePersonalizedStudyPlanOutput = z.infer<
  typeof GeneratePersonalizedStudyPlanOutputSchema
>;

export async function generatePersonalizedStudyPlan(
  input: GeneratePersonalizedStudyPlanInput
): Promise<GeneratePersonalizedStudyPlanOutput> {
  return generatePersonalizedStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedStudyPlanPrompt',
  input: {schema: GeneratePersonalizedStudyPlanInputSchema},
  output: {schema: GeneratePersonalizedStudyPlanOutputSchema},
  prompt: `You are an AI study assistant that helps students create personalized study plans.

You will take the course material and the student's quiz results and generate a study plan that prioritizes topics the student struggles with.

Course Material: {{{courseMaterial}}}
Quiz Results: {{{quizResults}}}

Study Plan:`,
});

const generatePersonalizedStudyPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedStudyPlanFlow',
    inputSchema: GeneratePersonalizedStudyPlanInputSchema,
    outputSchema: GeneratePersonalizedStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
