import * as dotenv from 'dotenv';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

dotenv.config({path: '.env'});

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
