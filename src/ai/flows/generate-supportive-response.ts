// src/ai/flows/generate-supportive-response.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating supportive and empathetic responses to user input.
 *
 * The flow takes user input as a string and returns a supportive response, potentially using techniques like cognitive reframing.
 *
 * @interface GenerateSupportiveResponseInput - Defines the input schema for the generateSupportiveResponse function.
 * @interface GenerateSupportiveResponseOutput - Defines the output schema for the generateSupportiveResponse function.
 * @function generateSupportiveResponse - The main function to call to generate a supportive response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSupportiveResponseInputSchema = z.object({
  userInput: z.string().describe('The user input to generate a supportive response for.'),
});
export type GenerateSupportiveResponseInput = z.infer<typeof GenerateSupportiveResponseInputSchema>;

const GenerateSupportiveResponseOutputSchema = z.object({
  supportiveResponse: z.string().describe('The generated supportive and empathetic response.'),
});
export type GenerateSupportiveResponseOutput = z.infer<typeof GenerateSupportiveResponseOutputSchema>;

export async function generateSupportiveResponse(input: GenerateSupportiveResponseInput): Promise<GenerateSupportiveResponseOutput> {
  return generateSupportiveResponseFlow(input);
}

const generateSupportiveResponsePrompt = ai.definePrompt({
  name: 'generateSupportiveResponsePrompt',
  input: {schema: GenerateSupportiveResponseInputSchema},
  output: {schema: GenerateSupportiveResponseOutputSchema},
  prompt: `You are a mental health chatbot designed to provide supportive and empathetic responses to users.
  Utilize evidence-based techniques such as cognitive reframing and motivational interviewing to help the user.

  User Input: {{{userInput}}}

  Supportive Response:`,
});

const generateSupportiveResponseFlow = ai.defineFlow(
  {
    name: 'generateSupportiveResponseFlow',
    inputSchema: GenerateSupportiveResponseInputSchema,
    outputSchema: GenerateSupportiveResponseOutputSchema,
  },
  async input => {
    const {output} = await generateSupportiveResponsePrompt(input);
    return output!;
  }
);
