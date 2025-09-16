
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
  studyPlan: z.string().describe('The personalized study plan as a JSON array of objects. Each object should have an id, topic, summary, and status ("not-started", "in-progress", or "completed").'),
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

You will take the course material and generate a detailed, step-by-step study plan.
Break the material down into logical topics. For each topic, provide a brief summary.

The final output must be an object with a "studyPlan" property containing a JSON string.
This JSON string should represent an array of objects. Each object must have the following properties: "id" (a unique number), "topic" (string), "summary" (string), and "status" (string, defaulting to "not-started").

Course Material: {{{courseMaterial}}}
Quiz Results: {{{quizResults}}}
`,
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
