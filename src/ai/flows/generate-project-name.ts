'use server';
/**
 * @fileOverview Generates a creative project name based on a summary.
 *
 * - generateProjectName - A function that handles the name generation.
 * - GenerateProjectNameInput - The input type for the function.
 * - GenerateProjectNameOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectNameInputSchema = z.object({
  summary: z.string().describe('A summary of the application idea.'),
});
export type GenerateProjectNameInput = z.infer<typeof GenerateProjectNameInputSchema>;

const GenerateProjectNameOutputSchema = z.object({
  projectName: z.string().describe('A creative, catchy, and short name for the application.'),
});
export type GenerateProjectNameOutput = z.infer<typeof GenerateProjectNameOutputSchema>;

export async function generateProjectName(input: GenerateProjectNameInput): Promise<GenerateProjectNameOutput> {
  return generateProjectNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectNamePrompt',
  input: {schema: GenerateProjectNameInputSchema},
  output: {schema: GenerateProjectNameOutputSchema},
  prompt: `You are an expert in branding and marketing. Your task is to generate a single, creative, and catchy name for a new application based on the provided summary. The name should be short, memorable, and ideally hint at the app's purpose.

  Application Summary:
  ---
  {{{summary}}}
  ---

  Generate one project name.
  `,
});

const generateProjectNameFlow = ai.defineFlow(
  {
    name: 'generateProjectNameFlow',
    inputSchema: GenerateProjectNameInputSchema,
    outputSchema: GenerateProjectNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
