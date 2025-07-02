'use server';
/**
 * @fileOverview Generates a final, comprehensive application development plan from structured inputs.
 *
 * - generateFinalSummary - A function that synthesizes the final plan.
 * - GenerateFinalSummaryInput - The input type for the function.
 * - GenerateFinalSummaryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFinalSummaryInputSchema = z.object({
  ideaSummary: z.string().describe('The initial structured idea summary.'),
  answers: z
    .record(z.string(), z.string())
    .describe('A map of questions and answers from the user refinement process.'),
  techStack: z.array(z.string()).describe('A list of recommended technology stacks.'),
  includeAuth: z.boolean().optional().describe('Whether to include user authentication.'),
  includeMonetization: z.boolean().optional().describe('Whether to include monetization.'),
});
export type GenerateFinalSummaryInput = z.infer<typeof GenerateFinalSummaryInputSchema>;

const GenerateFinalSummaryOutputSchema = z.object({
  finalSummary: z
    .string()
    .describe('The final, comprehensive application plan in markdown format.'),
});
export type GenerateFinalSummaryOutput = z.infer<typeof GenerateFinalSummaryOutputSchema>;

export async function generateFinalSummary(input: GenerateFinalSummaryInput): Promise<GenerateFinalSummaryOutput> {
  return generateFinalSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinalSummaryPrompt',
  input: {schema: GenerateFinalSummaryInputSchema},
  output: {schema: GenerateFinalSummaryOutputSchema},
  prompt: `You are an expert product manager and software architect. Your task is to synthesize all the information provided into a single, cohesive, and comprehensive application development plan.

The plan should be well-structured, easy to read, and formatted in Markdown. It should feel like a professional document that a development team could use to start building the application.

Here is the information you need to synthesize:

---
### 1. Initial Idea
This is the core concept extracted from the user's initial input.
{{{ideaSummary}}}
---
### 2. User Refinements
These are the decisions the user made to clarify the app's features, UI/UX, and flow.

{{#each answers}}
- **{{@key}}**
  - {{this}}
{{/each}}
{{#if includeAuth}}
- **User Authentication**: The user has chosen to include a user authentication system for account management.
{{/if}}
{{#if includeMonetization}}
- **Monetization**: The user has chosen to include a monetization strategy.
{{/if}}
---
{{#if techStack}}
### 3. Technology Recommendations
These are the suggested tech stacks for a web application.

{{#each techStack}}
- {{this}}
{{/each}}
---
{{/if}}

Now, generate the final "Application Development Plan" as a single markdown document. Do not just list the information above. Instead, weave it together into a coherent narrative. Start with a high-level executive summary, then detail the application's features, user experience, and technical considerations. If authentication or monetization are included, make sure to describe them in their own sections within the plan. Be professional and encouraging. The final output should be only the markdown document.
`,
});

const generateFinalSummaryFlow = ai.defineFlow(
  {
    name: 'generateFinalSummaryFlow',
    inputSchema: GenerateFinalSummaryInputSchema,
    outputSchema: GenerateFinalSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
