'use server';
/**
 * @fileOverview An AI agent that enhances a given code file based on user instructions.
 *
 * - enhanceCode - A function that handles the code enhancement process.
 * - EnhanceCodeInput - The input type for the enhanceCode function.
 * - EnhanceCodeOutput - The return type for the enhanceCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceCodeInputSchema = z.object({
  code: z.string().describe('The code of the file to be enhanced.'),
  prompt: z
    .string()
    .describe('The user\'s instruction on how to enhance the code.'),
});
export type EnhanceCodeInput = z.infer<typeof EnhanceCodeInputSchema>;

const EnhanceCodeOutputSchema = z.object({
  enhancedCode: z.string().describe('The new, enhanced code.'),
});
export type EnhanceCodeOutput = z.infer<typeof EnhanceCodeOutputSchema>;

export async function enhanceCode(
  input: EnhanceCodeInput
): Promise<EnhanceCodeOutput> {
  return enhanceCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceCodePrompt',
  input: {schema: EnhanceCodeInputSchema},
  output: {schema: EnhanceCodeOutputSchema},
  prompt: `You are an expert Next.js developer. Your task is to enhance the provided code file based on the user's instruction.

Guidelines:
- Only return the full, updated code for the single file. Do not add any new files.
- Maintain the existing tech stack (Next.js, React, TypeScript, Tailwind CSS, ShadCN).
- Ensure the generated code is complete, high-quality, and directly usable.

User's Instruction:
"{{{prompt}}}"

Code to enhance:
\`\`\`
{{{code}}}
\`\`\`
`,
});

const enhanceCodeFlow = ai.defineFlow(
  {
    name: 'enhanceCodeFlow',
    inputSchema: EnhanceCodeInputSchema,
    outputSchema: EnhanceCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
