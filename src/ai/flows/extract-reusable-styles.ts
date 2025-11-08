'use server';
/**
 * @fileOverview Identifies common CSS patterns and suggests reusable Tailwind CSS classes.
 *
 * - extractReusableStyles - A function that suggests reusable Tailwind CSS classes.
 * - ExtractReusableStylesInput - The input type for the extractReusableStyles function.
 * - ExtractReusableStylesOutput - The return type for the extractReusableStyles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractReusableStylesInputSchema = z.object({
  cssCode: z
    .string()
    .describe('The CSS code to analyze for reusable Tailwind CSS classes.'),
});
export type ExtractReusableStylesInput = z.infer<typeof ExtractReusableStylesInputSchema>;

const ExtractReusableStylesOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested reusable Tailwind CSS classes.'),
});
export type ExtractReusableStylesOutput = z.infer<typeof ExtractReusableStylesOutputSchema>;

export async function extractReusableStyles(
  input: ExtractReusableStylesInput
): Promise<ExtractReusableStylesOutput> {
  return extractReusableStylesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractReusableStylesPrompt',
  input: {schema: ExtractReusableStylesInputSchema},
  output: {schema: ExtractReusableStylesOutputSchema},
  prompt: `You are a CSS expert. Analyze the following CSS code and suggest reusable Tailwind CSS classes to maintain a consistent style and reduce code duplication.\n\nCSS code:\n\n{{cssCode}}\n\nSuggest reusable Tailwind CSS classes:\n`,
});

const extractReusableStylesFlow = ai.defineFlow(
  {
    name: 'extractReusableStylesFlow',
    inputSchema: ExtractReusableStylesInputSchema,
    outputSchema: ExtractReusableStylesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
