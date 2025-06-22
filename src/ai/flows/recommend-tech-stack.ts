'use server';

/**
 * @fileOverview An AI agent that recommends the top 3 most suitable tech stacks
 * based on the application type (e.g., web, mobile), ranked by popularity.
 *
 * - recommendTechStack - A function that handles the tech stack recommendation process.
 * - RecommendTechStackInput - The input type for the recommendTechStack function.
 * - RecommendTechStackOutput - The return type for the recommendTechStack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendTechStackInputSchema = z.object({
  applicationType: z
    .string()
    .describe('The type of application (e.g., web, mobile, desktop).'),
});
export type RecommendTechStackInput = z.infer<typeof RecommendTechStackInputSchema>;

const RecommendTechStackOutputSchema = z.object({
  techStacks: z
    .array(z.string())
    .describe('The top 3 tech stacks suitable for the application type, ranked by popularity.'),
});
export type RecommendTechStackOutput = z.infer<typeof RecommendTechStackOutputSchema>;

export async function recommendTechStack(input: RecommendTechStackInput): Promise<RecommendTechStackOutput> {
  return recommendTechStackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTechStackPrompt',
  input: {schema: RecommendTechStackInputSchema},
  output: {schema: RecommendTechStackOutputSchema},
  prompt: `You are an AI expert in software development.

You will recommend the top 3 most suitable tech stacks for the given application type, ranked by popularity.

Application Type: {{{applicationType}}}

Return the tech stacks in a JSON format.

Example:
{
  "techStacks": ["MEAN", "MERN", "LAMP"]
}
`,
});

const recommendTechStackFlow = ai.defineFlow(
  {
    name: 'recommendTechStackFlow',
    inputSchema: RecommendTechStackInputSchema,
    outputSchema: RecommendTechStackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
