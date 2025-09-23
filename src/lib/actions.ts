
'use server';

import {
  initialMentalStateAssessment,
  type InitialMentalStateAssessmentInput,
  type InitialMentalStateAssessmentOutput,
} from '@/ai/flows/initial-mental-state-assessment';
import {
  generateSupportiveResponse,
  type GenerateSupportiveResponseInput,
  type GenerateSupportiveResponseOutput,
} from '@/ai/flows/generate-supportive-response';

export async function getInitialAssessment(
  input: InitialMentalStateAssessmentInput
): Promise<InitialMentalStateAssessmentOutput> {
  try {
    const result = await initialMentalStateAssessment(input);
    return result;
  } catch (error) {
    console.error('Error in getInitialAssessment:', error);
    throw new Error('Failed to get initial assessment from AI.');
  }
}

export async function getSupportiveResponse(
  input: GenerateSupportiveResponseInput
): Promise<GenerateSupportiveResponseOutput> {
  try {
    const result = await generateSupportiveResponse(input);
    return result;
  } catch (error) {
    console.error('Error in getSupportiveResponse:', error);
    throw new Error('Failed to get supportive response from AI.');
  }
}
