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
  prompt: `You are an expert product manager and software architect. Your task is to synthesize all the information provided into a single, cohesive, and comprehensive application development plan in Markdown format.

**Instructions:**
1.  **Synthesize, Don't Just List:** Weave the information together into a coherent narrative. You MUST generate sections like "Core Idea", "Key Features", and "User Flow" by synthesizing the user's idea and answers.
2.  **Strictly Adhere to Toggles:**
    - Only include a "User Authentication" section if \`includeAuth\` is true.
    - Crucially, if \`includeMonetization\` is false, you MUST NOT suggest or detail any monetization features in any section (including Key Features), even if they were mentioned in the initial idea. The user has explicitly disabled this option. If it is true, you should include a "Monetization" section.
    - Only include a "Technology Recommendations" section if the \`techStack\` array is not empty.
    - If any of these are not provided, **you must omit their sections entirely.** Do not mention that they were excluded.
3.  **No Roadmaps or Timelines:** **Crucially, do not add a "Development Roadmap," "Timeline," or any other project management sections.** The output should be a plan, not a schedule.
4.  **Start with Content:** The generated markdown document must start directly with the first heading (e.g., \`## Core Idea\`). Do not add a main title like "# Application Development Plan".

Here is the information you must synthesize:

---
### Source Information

**1. Initial Idea Summary & User Refinements (Q&A):**
{{{ideaSummary}}}

{{#each answers}}
- **Question: {{@key}}**
  - Answer: {{this}}
{{/each}}

{{#if includeAuth}}
**2. User Authentication:** The user has chosen to include a user authentication system.
{{/if}}

{{#if includeMonetization}}
**3. Monetization:** The user has chosen to include a monetization strategy.
{{/if}}

{{#if techStack}}
**4. Technology Recommendations:**
{{#each techStack}}
- {{this}}
{{/each}}
{{/if}}
---

Now, generate the final application plan based **only** on the information provided above, following all instructions.
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
