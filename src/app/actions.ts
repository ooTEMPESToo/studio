'use server';

import { suggestReactComponents } from '@/ai/flows/suggest-react-components';
import { extractReusableStyles } from '@/ai/flows/extract-reusable-styles';

export async function getAiSuggestions(code: string): Promise<{
  components?: string;
  styles?: string;
  error?: string;
}> {
  if (!code) {
    return { error: 'Code input is empty.' };
  }

  try {
    // We can run these in parallel to speed up the process
    const [componentsResult, stylesResult] = await Promise.allSettled([
      suggestReactComponents({ code }),
      extractReusableStyles({ cssCode: code }),
    ]);

    const components =
      componentsResult.status === 'fulfilled'
        ? componentsResult.value.suggestions
        : '';
    const styles =
      stylesResult.status === 'fulfilled'
        ? stylesResult.value.suggestions.join('\n')
        : '';

    if (
      componentsResult.status === 'rejected' &&
      stylesResult.status === 'rejected'
    ) {
      console.error('Both AI calls failed:', { componentsResult, stylesResult });
      throw new Error('Failed to get suggestions from AI.');
    }

    return {
      components,
      styles,
    };
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: 'An unknown error occurred while analyzing the code.' };
  }
}
