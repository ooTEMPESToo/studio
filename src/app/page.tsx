'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { CodeInputPane } from '@/components/CodeInputPane';
import { SuggestionsPane } from '@/components/SuggestionsPane';
import { OutputPane } from '@/components/OutputPane';
import { getAiSuggestions, type TransformedFile } from '@/app/actions';
import { useToast } from '@/components/ui/use-toast';

export default function Home() {
  const { toast } = useToast();
  const [code, setCode] = useState<string>('');
  const [componentSuggestions, setComponentSuggestions] = useState<string>('');
  const [tailwindSuggestions, setTailwindSuggestions] = useState<string>('');
  const [projectFiles, setProjectFiles] = useState<TransformedFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please paste some code before analyzing.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setComponentSuggestions('');
    setTailwindSuggestions('');
    setProjectFiles([]);

    const result = await getAiSuggestions(code);
    setIsLoading(false);

    if (result.error) {
      toast({
        title: 'Analysis Failed',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      setComponentSuggestions(result.components || '');
      setTailwindSuggestions(result.styles || '');
      setProjectFiles(result.project || []);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 lg:p-6">
        <div className="grid h-full grid-cols-1 gap-6 xl:grid-cols-10">
          <div className="xl:col-span-3">
            <CodeInputPane
              code={code}
              setCode={setCode}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          </div>
          <div className="xl:col-span-4">
            <SuggestionsPane
              suggestions={componentSuggestions}
              isLoading={isLoading}
            />
          </div>
          <div className="xl:col-span-3">
            <OutputPane
              tailwindSuggestions={tailwindSuggestions}
              projectFiles={projectFiles}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
