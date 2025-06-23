'use server';
/**
 * @fileOverview Generates a setup prompt and file structure based on the final application plan.
 *
 * - generateProjectSetup - A function that generates the setup information.
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
  setupPromptContent: z.string().describe('The content for the application setup prompt, derived from the final plan.'),
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
  prompt: `You are a senior software engineer tasked with creating a comprehensive "Setup Prompt" for an AI developer. This document is the foundational blueprint and MUST contain all necessary information to begin the project.

Based on the final application plan provided below, generate two things:
1.  A "Setup Prompt" document.
2.  A recommended file structure for a Next.js project.

**Setup Prompt Instructions:**
The Setup Prompt must be a complete and self-contained set of initial instructions. It must strictly adhere to the information from the user's plan and include the following sections ONLY:
- **Core Idea**: A brief summary of the application.
- **Objectives**: The main goals the application aims to achieve.
- **Key Features**: A comprehensive list of the core features and functionalities. This section is critical.
- **User Flow**: A detailed description of the user's journey through the app.
- **Recommended Tech Stack**: The technology stack chosen for the application. **If no tech stack is mentioned in the application plan, omit this section entirely.**

**Crucially, do not add a main title or heading like "# Setup Prompt" to the document.** Start directly with the "Core Idea" section.

**File Structure Instructions:**
The file structure should be represented as a markdown code block, showing the key directories and files (e.g., /src/app, /src/components, /src/lib, etc.) appropriate for the application described.
The response for the fileStructure field MUST begin with the line "Use this file structure while developing the application..." followed by the markdown code block.

**Application Plan:**
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
