import * as dotenv from 'dotenv';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import * as path from 'path';

// Load environment variables from the root .env file
dotenv.config({path: path.resolve(process.cwd(), '.env')});

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
