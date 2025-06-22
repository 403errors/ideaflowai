'use server';
/**
 * @fileOverview Generates a detailed engineering prompt for a specific feature.
 *
 * - generateFeaturePrompt - A function that handles the prompt generation process.
 * - GenerateFeaturePromptInput - The input type for the function.
 * - GenerateFeaturePromptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFeaturePromptInputSchema = z.object({
  setupPrompt: z.string().describe('The overall setup prompt for the application.'),
  featureTitle: z.string().describe('The title of the feature to generate a prompt for.'),
  featureDescription: z.string().describe('The detailed description of the feature.'),
});
export type GenerateFeaturePromptInput = z.infer<typeof GenerateFeaturePromptInputSchema>;

const GenerateFeaturePromptOutputSchema = z.object({
  featurePrompt: z.string().describe('A detailed, sophisticated engineering prompt for an AI to generate code for the feature.'),
});
export type GenerateFeaturePromptOutput = z.infer<typeof GenerateFeaturePromptOutputSchema>;

export async function generateFeaturePrompt(input: GenerateFeaturePromptInput): Promise<GenerateFeaturePromptOutput> {
  return generateFeaturePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFeaturePrompt',
  input: {schema: GenerateFeaturePromptInputSchema},
  output: {schema: GenerateFeaturePromptOutputSchema},
  prompt: `You are an expert prompt engineer specializing in creating instructions for AI code generators. Your task is to create a detailed and sophisticated prompt that will instruct an AI assistant to generate production-quality code for a specific feature.

The generated prompt should be a standalone set of instructions for another LLM.

**Overall Application Plan (for context):**
---
{{{setupPrompt}}}
---

**Feature to create a prompt for:**
- **Title:** {{{featureTitle}}}
- **Description:** {{{featureDescription}}}

**Your Task:**
Generate a new, detailed prompt that an AI developer can use to write the code for the feature described above. This new prompt should include:
1.  A clear summary of the feature to be built.
2.  Specific instructions on which files to create or modify.
3.  Guidance on using the recommended tech stack (Next.js, React, TypeScript, ShadCN UI, Tailwind CSS).
4.  Instructions on component structure, props, and state management.
5.  Mention the use of Lucide React for icons and \`https://placehold.co\` for placeholder images.
6.  A reminder to follow best practices like creating reusable components, using server components where possible, and ensuring code is clean and without comments.
7.  The final output from you should be ONLY the text of the generated prompt. Do not wrap it in markdown or anything else.
`,
});

const generateFeaturePromptFlow = ai.defineFlow(
  {
    name: 'generateFeaturePromptFlow',
    inputSchema: GenerateFeaturePromptInputSchema,
    outputSchema: GenerateFeaturePromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
