'use server';

import { suggestReactComponents } from '@/ai/flows/suggest-react-components';
import { extractReusableStyles } from '@/ai/flows/extract-reusable-styles';
import {
  generateProjectStructure,
  type GenerateProjectStructureOutput,
} from '@/ai/flows/generate-project-structure';

export type TransformedFile = GenerateProjectStructureOutput['files'][0];

export async function getAiSuggestions(code: string): Promise<{
  components?: string;
  styles?: string;
  project?: TransformedFile[];
  error?: string;
}> {
  if (!code) {
    return { error: 'Code input is empty.' };
  }

  try {
    // We can run these in parallel to speed up the process
    const [componentsResult, stylesResult, projectResult] = await Promise.allSettled([
      suggestReactComponents({ code }),
      extractReusableStyles({ cssCode: code }),
      generateProjectStructure({ code }),
    ]);

    const components =
      componentsResult.status === 'fulfilled'
        ? componentsResult.value.suggestions
        : '';
    const styles =
      stylesResult.status === 'fulfilled'
        ? stylesResult.value.suggestions.join('\n')
        : '';
    const project =
      projectResult.status === 'fulfilled'
        ? projectResult.value.files
        : [];

    if (
      componentsResult.status === 'rejected' &&
      stylesResult.status === 'rejected' &&
      projectResult.status === 'rejected'
    ) {
      console.error('All AI calls failed:', { componentsResult, stylesResult, projectResult });
      throw new Error('Failed to get suggestions from AI.');
    }

    return {
      components,
      styles,
      project,
    };
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: 'An unknown error occurred while analyzing the code.' };
  }
}
