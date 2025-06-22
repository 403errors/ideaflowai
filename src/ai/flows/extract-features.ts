'use server';
/**
 * @fileOverview Extracts a structured list of features from a setup prompt.
 *
 * - extractFeatures - A function that handles the feature extraction process.
 * - ExtractFeaturesInput - The input type for the extractFeatures function.
 * - ExtractFeaturesOutput - The return type for the extractFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractFeaturesInputSchema = z.object({
  setupPrompt: z.string().describe('The markdown setup prompt containing a "Key Features" section.'),
});
export type ExtractFeaturesInput = z.infer<typeof ExtractFeaturesInputSchema>;

const FeatureSchema = z.object({
  title: z.string().describe('A concise title for the feature (e.g., "User Authentication").'),
  description: z.string().describe('A detailed, one-paragraph description of the feature and its requirements.'),
});

const ExtractFeaturesOutputSchema = z.object({
  features: z.array(FeatureSchema).describe('An array of features extracted from the prompt.'),
});
export type ExtractFeaturesOutput = z.infer<typeof ExtractFeaturesOutputSchema>;

export async function extractFeatures(input: ExtractFeaturesInput): Promise<ExtractFeaturesOutput> {
  return extractFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractFeaturesPrompt',
  input: {schema: ExtractFeaturesInputSchema},
  output: {schema: ExtractFeaturesOutputSchema},
  prompt: `You are an expert at parsing technical documents. Your task is to extract the features from the "Key Features" section of the provided setup prompt.

For each feature, provide a concise but descriptive title and a detailed, one-paragraph description of what the feature entails based on the user's plan.

Only extract features listed under the "Key Features" or "Core Features" heading.

Setup Prompt:
---
{{{setupPrompt}}}
---
`,
});

const extractFeaturesFlow = ai.defineFlow(
  {
    name: 'extractFeaturesFlow',
    inputSchema: ExtractFeaturesInputSchema,
    outputSchema: ExtractFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
