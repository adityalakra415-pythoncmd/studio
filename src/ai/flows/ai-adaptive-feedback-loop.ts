// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview This file contains the Genkit flow for the AI Adaptive Feedback Loop user story.
 *
 * The AI Adaptive Feedback Loop flow tracks student progress and automatically adjusts the difficulty
 * of questions and the focus of the study plan in real-time.
 *
 * - adaptiveFeedbackLoop - The main function that orchestrates the adaptive feedback process.
 * - AdaptiveFeedbackLoopInput - The input type for the adaptiveFeedbackLoop function.
 * - AdaptiveFeedbackLoopOutput - The output type for the adaptiveFeedbackLoop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveFeedbackLoopInputSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student.'),
  topic: z.string().describe('The topic the student is currently studying.'),
  quizResults: z.array(z.object({
    questionId: z.string().describe('The unique identifier for the question.'),
    isCorrect: z.boolean().describe('Whether the student answered the question correctly.'),
  })).describe('The results of the student\'s most recent quiz.'),
  currentStudyPlan: z.array(z.string()).describe('The student\'s current study plan (list of topic IDs).'),
  content: z.string().describe('The lecture notes, textbook PDFs, or links to educational videos to analyze.'),
});
export type AdaptiveFeedbackLoopInput = z.infer<typeof AdaptiveFeedbackLoopInputSchema>;

const AdaptiveFeedbackLoopOutputSchema = z.object({
  adjustedStudyPlan: z.array(z.string()).describe('The adjusted study plan based on the student\'s performance.'),
  difficultyAdjustment: z.string().describe('A description of how the difficulty of questions should be adjusted.'),
});
export type AdaptiveFeedbackLoopOutput = z.infer<typeof AdaptiveFeedbackLoopOutputSchema>;

export async function adaptiveFeedbackLoop(input: AdaptiveFeedbackLoopInput): Promise<AdaptiveFeedbackLoopOutput> {
  return adaptiveFeedbackLoopFlow(input);
}

const adaptiveFeedbackLoopPrompt = ai.definePrompt({
  name: 'adaptiveFeedbackLoopPrompt',
  input: {schema: AdaptiveFeedbackLoopInputSchema},
  output: {schema: AdaptiveFeedbackLoopOutputSchema},
  prompt: `You are an AI study assistant that helps students learn more effectively.

You will receive the results of a student's quiz, their current study plan, and the content they are studying.
Based on this information, you will adjust the study plan and provide guidance on how to adjust the difficulty of questions.

Student ID: {{{studentId}}}
Topic: {{{topic}}}
Quiz Results: {{#each quizResults}}{{this.questionId}}: {{this.isCorrect}} {{/each}}
Current Study Plan: {{#each currentStudyPlan}}{{{this}}} {{/each}}
Content: {{{content}}}

Adjust the study plan to prioritize topics the student is struggling with. If the student is excelling, move them on to more advanced topics.
Also, suggest how to adjust the difficulty of questions. For example, if the student is struggling, suggest simpler questions. If the student is excelling, suggest more challenging questions.
`,
});

const adaptiveFeedbackLoopFlow = ai.defineFlow(
  {
    name: 'adaptiveFeedbackLoopFlow',
    inputSchema: AdaptiveFeedbackLoopInputSchema,
    outputSchema: AdaptiveFeedbackLoopOutputSchema,
  },
  async input => {
    const {output} = await adaptiveFeedbackLoopPrompt(input);
    return output!;
  }
);
