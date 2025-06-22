// src/ai/flows/extract-idea.ts
'use server';
/**
 * @fileOverview Extracts the core idea from user input (text, image, or PDF) into a structured markdown format.
 *
 * - extractIdea - A function that handles the idea extraction process.
 * - ExtractIdeaInput - The input type for the extractIdea function.
 * - ExtractIdeaOutput - The return type for the extractIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractIdeaInputSchema = z.object({
  input: z.string().describe('The user input containing the application idea. This can be text, an image data URI, or a PDF data URI.'),
});
export type ExtractIdeaInput = z.infer<typeof ExtractIdeaInputSchema>;

const ExtractIdeaOutputSchema = z.object({
  markdownOutput: z.string().describe('The extracted idea in markdown format, with sections for Overview, Goals, Key Components, and Constraints.'),
});
export type ExtractIdeaOutput = z.infer<typeof ExtractIdeaOutputSchema>;

export async function extractIdea(input: ExtractIdeaInput): Promise<ExtractIdeaOutput> {
  return extractIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractIdeaPrompt',
  input: {schema: ExtractIdeaInputSchema},
  output: {schema: ExtractIdeaOutputSchema},
  prompt: `You are an expert in extracting key information from various input formats (text, images, PDFs). Your goal is to distill the essence of an application idea into a structured markdown format.

  The markdown should have the following sections:

  ## Overview
  A brief summary of the application idea.

  ## Goals
  The objectives the application aims to achieve.

  ## Key Components
  The essential features and functionalities of the application.

  ## Constraints
  Any limitations or challenges in developing the application.

  Here is the input:
  {{input}}`,
});

const extractIdeaFlow = ai.defineFlow(
  {
    name: 'extractIdeaFlow',
    inputSchema: ExtractIdeaInputSchema,
    outputSchema: ExtractIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
