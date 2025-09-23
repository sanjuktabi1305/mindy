import { config } from 'dotenv';
import * as path from 'path';

// Explicitly load .env from the project root
config({ path: path.resolve(process.cwd(), '.env') });

import '@/ai/flows/initial-mental-state-assessment.ts';
import '@/ai/flows/generate-supportive-response.ts';
