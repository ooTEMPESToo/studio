'use server';

/**
 * @fileOverview A React component suggestion AI agent.
 *
 * - suggestReactComponents - A function that handles the React component suggestion process.
 * - SuggestReactComponentsInput - The input type for the suggestReactComponents function.
 * - SuggestReactComponentsOutput - The return type for the suggestReactComponents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReactComponentsInputSchema = z.object({
  code: z
    .string()
    .describe(
      'The HTML/CSS/JS code to analyze for React component suggestions.'
    ),
});
export type SuggestReactComponentsInput = z.infer<typeof SuggestReactComponentsInputSchema>;

const SuggestReactComponentsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('The suggested React components based on the input code.'),
});
export type SuggestReactComponentsOutput = z.infer<typeof SuggestReactComponentsOutputSchema>;

export async function suggestReactComponents(
  input: SuggestReactComponentsInput
): Promise<SuggestReactComponentsOutput> {
  return suggestReactComponentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReactComponentsPrompt',
  input: {schema: SuggestReactComponentsInputSchema},
  output: {schema: SuggestReactComponentsOutputSchema},
  prompt: `You are an AI assistant that suggests React components based on the provided HTML/CSS/JS code.\n\nAnalyze the following code and provide suggestions for React components, including their names and responsibilities. Explain why each component is a good division of the code.\n\nCode: {{{code}}}`,
});

const suggestReactComponentsFlow = ai.defineFlow(
  {
    name: 'suggestReactComponentsFlow',
    inputSchema: SuggestReactComponentsInputSchema,
    outputSchema: SuggestReactComponentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
