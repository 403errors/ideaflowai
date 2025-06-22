import { config } from 'dotenv';
config();

import '@/ai/flows/extract-idea.ts';
import '@/ai/flows/generate-mcq.ts';
import '@/ai/flows/recommend-tech-stack.ts';