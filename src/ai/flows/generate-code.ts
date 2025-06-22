'use server';
/**
 * @fileOverview Generates code for a specific feature based on a setup prompt.
 *
 * - generateCode - A function that handles the code generation process.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeInputSchema = z.object({
  setupPrompt: z.string().describe('The overall setup prompt for the application.'),
  featureTitle: z.string().describe('The title of the feature to generate code for.'),
  featureDescription: z.string().describe('The detailed description of the feature.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const FileChangeSchema = z.object({
    filePath: z.string().describe('The full path of the file to be created or modified.'),
    content: z.string().describe('The complete code content for the file.'),
});

const GenerateCodeOutputSchema = z.object({
  files: z.array(FileChangeSchema).describe('An array of files with their content to be generated or modified.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;


export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: {schema: GenerateCodeInputSchema},
  output: {schema: GenerateCodeOutputSchema},
  prompt: `You are an expert Next.js developer specializing in creating production-quality code using React, TypeScript, ShadCN UI, and Tailwind CSS.

Your task is to generate the necessary code for a specific feature based on the provided application plan.

**Application Plan:**
---
{{{setupPrompt}}}
---

**Feature to Implement:**
- **Title:** {{{featureTitle}}}
- **Description:** {{{featureDescription}}}

**Instructions:**
1.  Generate the complete code for the feature. This may involve creating new components, modifying existing files, or adding new pages.
2.  Provide the output as an array of file objects, where each object contains the \`filePath\` and the full \`content\` of the file.
3.  Ensure the code is clean, well-structured, and follows best practices for the tech stack (Next.js App Router, Server Components where possible, etc.).
4.  Use ShadCN UI components (e.g., <Button>, <Card>, <Input>) where appropriate for UI elements.
5.  Use Lucide React for icons.
6.  Use placeholder images from \`https://placehold.co/<width>x<height>.png\` if needed.
7.  DO NOT include comments in your code.
`,
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
