'use server';
/**
 * @fileOverview Generates project setup files based on the final application plan.
 *
 * - generateProjectSetup - A function that generates setup files.
 * - GenerateProjectSetupInput - The input type for the function.
 * - GenerateProjectSetupOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectSetupInputSchema = z.object({
  finalSummary: z.string().describe('The final application plan in markdown format.'),
});
export type GenerateProjectSetupInput = z.infer<typeof GenerateProjectSetupInputSchema>;

const GenerateProjectSetupOutputSchema = z.object({
  readmeContent: z.string().describe('The content for the new README.md file.'),
  fileStructure: z.string().describe('A markdown representation of the recommended project file structure.'),
});
export type GenerateProjectSetupOutput = z.infer<typeof GenerateProjectSetupOutputSchema>;

export async function generateProjectSetup(input: GenerateProjectSetupInput): Promise<GenerateProjectSetupOutput> {
  return generateProjectSetupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectSetupPrompt',
  input: {schema: GenerateProjectSetupInputSchema},
  output: {schema: GenerateProjectSetupOutputSchema},
  prompt: `You are a senior software engineer creating a project setup for a new web application. Based on the following application plan, generate a new README.md file and a recommended file structure.

The README should be comprehensive, including sections for:
- Project Title
- Description
- Key Features
- Tech Stack
- Getting Started (installation and running locally)

The file structure should be represented as a markdown code block, showing the key directories and files (e.g., /src, /components, /pages, etc.).

Application Plan:
---
{{{finalSummary}}}
---
`,
});

const generateProjectSetupFlow = ai.defineFlow(
  {
    name: 'generateProjectSetupFlow',
    inputSchema: GenerateProjectSetupInputSchema,
    outputSchema: GenerateProjectSetupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
