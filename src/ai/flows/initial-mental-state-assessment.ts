'use server';
/**
 * @fileOverview An AI agent for initial mental state assessment.
 *
 * - initialMentalStateAssessment - A function that gathers user information and screens for mental state.
 * - InitialMentalStateAssessmentInput - The input type for the initialMentalStateAssessment function.
 * - InitialMentalStateAssessmentOutput - The return type for the initialMentalStateAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialMentalStateAssessmentInputSchema = z.object({
  name: z.string().describe('The user\'s name.'),
  age: z.number().describe('The user\'s age.'),
  location: z.string().describe('The user\'s general location (city, state).'),
});
export type InitialMentalStateAssessmentInput = z.infer<typeof InitialMentalStateAssessmentInputSchema>;

const InitialMentalStateAssessmentOutputSchema = z.object({
  mentalStateSummary: z.string().describe('A brief summary of the user\'s mental state based on initial screening questions.'),
  recommendations: z.string().describe('Initial recommendations for support and resources.'),
  needsQuestionnaire: z.boolean().describe('Whether the user needs to fill out a standardized questionnaire.'),
});
export type InitialMentalStateAssessmentOutput = z.infer<typeof InitialMentalStateAssessmentOutputSchema>;

export async function initialMentalStateAssessment(input: InitialMentalStateAssessmentInput): Promise<InitialMentalStateAssessmentOutput> {
  return initialMentalStateAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'initialMentalStateAssessmentPrompt',
  input: {schema: InitialMentalStateAssessmentInputSchema},
  output: {schema: InitialMentalStateAssessmentOutputSchema},
  prompt: `You are a mental health chatbot designed to assess a user's initial mental state and provide personalized support.\n\nFirst, gather basic information about the user:\n- Name: {{{name}}}
- Age: {{{age}}}
- Location: {{{location}}}\n\nAsk a few screening questions to understand the user's current mental state. Tailor the questions to be empathetic and supportive.\n\nBased on the user's input, provide a brief summary of their mental state in the mentalStateSummary field. Offer initial recommendations for support and resources in the recommendations field.\n\nDecide whether the user needs to fill out a standardized questionnaire based on their responses to the screening questions, setting the needsQuestionnaire field appropriately.\n\nExample Questions:\n1. How have you been feeling lately?\n2. Have you been experiencing any significant stress or anxiety?\n3. Are you having thoughts of self-harm?\n`,
});

const initialMentalStateAssessmentFlow = ai.defineFlow(
  {
    name: 'initialMentalStateAssessmentFlow',
    inputSchema: InitialMentalStateAssessmentInputSchema,
    outputSchema: InitialMentalStateAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
