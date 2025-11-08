'use server';

/**
 * @fileOverview An AI agent that generates a Next.js project structure from legacy code.
 *
 * - generateProjectStructure - A function that handles the project structure generation.
 * - GenerateProjectStructureInput - The input type for the generateProjectStructure function.
 * - GenerateProjectStructureOutput - The return type for the generateProjectStructure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FileSchema = z.object({
  path: z
    .string()
    .describe(
      'The full path of the file, e.g., "src/app/page.tsx" or "src/components/Header.tsx".'
    ),
  content: z.string().describe('The generated code for the file.'),
});

const GenerateProjectStructureInputSchema = z.object({
  code: z
    .string()
    .describe('The legacy HTML, CSS, and/or JavaScript code to convert.'),
});
export type GenerateProjectStructureInput = z.infer<
  typeof GenerateProjectStructureInputSchema
>;

const GenerateProjectStructureOutputSchema = z.object({
  files: z
    .array(FileSchema)
    .describe('An array of files representing the project structure.'),
});
export type GenerateProjectStructureOutput = z.infer<
  typeof GenerateProjectStructureOutputSchema
>;

export async function generateProjectStructure(
  input: GenerateProjectStructureInput
): Promise<GenerateProjectStructureOutput> {
  return generateProjectStructureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectStructurePrompt',
  input: {schema: GenerateProjectStructureInputSchema},
  output: {schema: GenerateProjectStructureOutputSchema},
  prompt: `You are an expert Next.js developer. Your task is to convert the provided legacy code (HTML, CSS, JavaScript) into a modern, production-ready Next.js application.

Guidelines:
- Use Next.js App Router.
- Use TypeScript.
- Use Tailwind CSS for styling. You can use ShadCN UI components where appropriate (e.g., Button, Card).
- Break down the UI into logical React components.
- Create a clear and organized file structure.
- Ensure the generated code is complete and directly usable.

Convert the following code:
{{{code}}}
`,
});

const generateProjectStructureFlow = ai.defineFlow(
  {
    name: 'generateProjectStructureFlow',
    inputSchema: GenerateProjectStructureInputSchema,
    outputSchema: GenerateProjectStructureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
