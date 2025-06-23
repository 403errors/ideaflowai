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
  fileStructure: z.string().describe('A markdown representation of the recommended project file structure.'),
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
  prompt: `You are an expert prompt engineer and senior software architect. Your task is to create a detailed, consistent, and sophisticated prompt that will instruct an AI assistant to generate production-quality code for a specific feature within an existing Next.js project.

The generated prompt must be a complete, standalone set of instructions for another LLM. It is part of a sequence, so it MUST be consistent with the overall application plan and assume previously generated features are already implemented.

**Overall Application Plan (for context):**
---
{{{setupPrompt}}}
---

**Project File Structure (for reference):**
---
{{{fileStructure}}}
---

**Feature to create a prompt for:**
- **Title:** {{{featureTitle}}}
- **Description:** {{{featureDescription}}}

**Your Task:**
Generate a new, detailed engineering prompt that an AI developer can use to write the code for the feature described above. This new prompt must be VERY consistent with the plan and file structure. It must include:

1.  **Feature Summary**: A clear summary of the feature to be built and how it fits into the overall application.
2.  **File Modifications**: Specific instructions on which files to create or modify. Refer to the provided file structure to ensure consistency. For new files, specify the exact path (e.g., \`src/components/new-component.tsx\`).
3.  **Component Logic**: Detailed logic for React components, including state management (use \`useState\` for local state), props (define their names and types), and any necessary hooks (\`useEffect\`, \`useCallback\`).
4.  **Technical Implementation**: Clear guidance on using the recommended tech stack (Next.js App Router, React, TypeScript, ShadCN UI, Tailwind CSS). Mention specific ShadCN components (\`<Button>\`, \`<Card>\`) or Lucide icons where appropriate.
5.  **Edge Cases**: Briefly mention potential edge cases to consider (e.g., empty states, error handling, loading states).
6.  **Best Practices**: A reminder to create reusable components, use server components where possible, ensure code is clean and without comments, and use placeholder images from \`https://placehold.co\`.

The final output from you should be ONLY the text of the generated prompt itself, ready for another AI to execute. Do not wrap it in markdown or add any conversational text.
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
