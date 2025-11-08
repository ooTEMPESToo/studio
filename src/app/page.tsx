'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { CodeInputPane } from '@/components/CodeInputPane';
import { SuggestionsPane } from '@/components/SuggestionsPane';
import { OutputPane } from '@/components/OutputPane';
import { getAiSuggestions, type TransformedFile } from '@/app/actions';
import { useToast } from '@/components/ui/use-toast';

export type Framework = 'nextjs' | 'react' | 'angular';

export default function Home() {
  const { toast } = useToast();
  const [code, setCode] = useState<string>('');
  const [componentSuggestions, setComponentSuggestions] = useState<string>('');
  const [tailwindSuggestions, setTailwindSuggestions] = useState<string>('');
  const [projectFiles, setProjectFiles] = useState<TransformedFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [framework, setFramework] = useState<Framework>('nextjs');
  const [history, setHistory] = useState<string[]>([]);

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

    if (code && !history.includes(code)) {
      setHistory([code, ...history]);
    }

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

  const handleLoadHistory = (historyCode: string) => {
    setCode(historyCode);
  };

  const handleDeleteHistory = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  };
  
  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header 
        history={history}
        onLoadHistory={handleLoadHistory}
        onDeleteHistory={handleDeleteHistory}
        onClearHistory={handleClearHistory}
        isLoading={isLoading}
      />
      <main className="flex-1 p-4 lg:p-6">
        <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="md:col-span-1">
            <CodeInputPane
              code={code}
              setCode={setCode}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              framework={framework}
              setFramework={setFramework}
            />
          </div>
          <div className="md:col-span-1">
            <SuggestionsPane
              suggestions={componentSuggestions}
              isLoading={isLoading}
            />
          </div>
          <div className="md:col-span-2 xl:col-span-1">
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
