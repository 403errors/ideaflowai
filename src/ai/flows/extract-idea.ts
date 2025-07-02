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
  markdownOutput: z
    .string()
    .describe(
      'The extracted idea in markdown format, with sections for Overview, Goals, Key Features, Target Audience, Potential Monetization, and Constraints.'
    ),
});
export type ExtractIdeaOutput = z.infer<typeof ExtractIdeaOutputSchema>;

export async function extractIdea(input: ExtractIdeaInput): Promise<ExtractIdeaOutput> {
  return extractIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractIdeaPrompt',
  input: {
    schema: z.object({
      text: z.string().optional().describe('Textual description of the application idea.'),
      media: z
        .string()
        .optional()
        .describe(
          "A file containing the application idea, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {schema: ExtractIdeaOutputSchema},
  prompt: `You are an expert product manager and business analyst. Your task is to analyze the user's input, which could be text, an image, or a PDF, and extract all relevant details to create a structured project idea in markdown format.

Analyze the provided input and generate a markdown document with the following sections:

## Overview
A concise summary of the application idea. What is the core problem it solves?

## Goals
List the primary objectives and desired outcomes for this project.

## Key Features
Detail the essential features and functionalities. Be specific.

## Target Audience
Describe the ideal users for this application.

## Potential Monetization
Suggest possible ways the application could generate revenue (e.g., subscriptions, ads, one-time purchases).

## Constraints
Identify any limitations, challenges, or non-goals mentioned or implied.

Here is the user's input to analyze:
{{#if text}}
{{{text}}}
{{/if}}
{{#if media}}
{{media url=media}}
{{/if}}
`,
});

const extractIdeaFlow = ai.defineFlow(
  {
    name: 'extractIdeaFlow',
    inputSchema: ExtractIdeaInputSchema,
    outputSchema: ExtractIdeaOutputSchema,
  },
  async ({input}) => {
    const isDataUri = input.startsWith('data:');

    const promptInput: {text?: string; media?: string} = {};
    if (isDataUri) {
      promptInput.media = input;
      // Providing text context helps the model know what to do with the file.
      promptInput.text = 'Analyze the attached file which contains an application idea.';
    } else {
      promptInput.text = input;
    }

    const {output} = await prompt(promptInput);
    return output!;
  }
);
