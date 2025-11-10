'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { CodeInputPane } from '@/components/CodeInputPane';
import { SuggestionsPane } from '@/components/SuggestionsPane';
import { OutputPane } from '@/components/OutputPane';
import { getAiSuggestions, type TransformedFile, enhanceCodeWithAi } from '@/app/actions';
import { useToast } from '@/components/ui/use-toast';
import UploadOptions from '@/components/UploadOptions'; // ✅ new import

export type Framework = 'nextjs' | 'react' | 'angular';

export default function Home() {
  const { toast } = useToast();
  const [code, setCode] = useState<string>('');
  const [componentSuggestions, setComponentSuggestions] = useState<string>('');
  const [tailwindSuggestions, setTailwindSuggestions] = useState<string>('');
  const [projectFiles, setProjectFiles] = useState<TransformedFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [framework, setFramework] = useState<Framework>('nextjs');
  const [history, setHistory] = useState<string[]>([]);

  // 🔹 Handle Analyze
  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please paste or upload some code before analyzing.',
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

  // 🔹 Handle Enhance
  const handleEnhance = async (fileToEnhance: TransformedFile, prompt: string) => {
    setIsEnhancing(true);
    const result = await enhanceCodeWithAi(fileToEnhance.content, prompt);
    setIsEnhancing(false);

    if (result.error) {
      toast({
        title: 'Enhancement Failed',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.enhancedCode) {
      setProjectFiles(currentFiles =>
        currentFiles.map(file =>
          file.path === fileToEnhance.path
            ? { ...file, content: result.enhancedCode! }
            : file
        )
      );
      toast({
        title: 'Code Enhanced',
        description: `${fileToEnhance.path} has been updated.`,
      });
    }
  };

  // 🔹 Handle History
  const handleLoadHistory = (historyCode: string) => {
    setCode(historyCode);
  };

  const handleDeleteHistory = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // 🔹 Handle Uploads
  const handleUploadFromComputer = async (file: File) => {
    const text = await file.text();
    setCode(text);
    toast({
      title: 'File Uploaded',
      description: `Loaded ${file.name} from your computer.`,
    });
  };

  const handleLoadFromGitHub = (content: string) => {
    setCode(content);
    toast({
      title: 'Loaded from GitHub',
      description: 'Code fetched successfully from your repository.',
    });
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
        <div className="flex flex-col gap-6">

          {/* ✅ Upload Options Added Here */}
          <div className="flex justify-end">
            <UploadOptions
              onUploadFromComputer={handleUploadFromComputer}
              onLoadFromGitHub={handleLoadFromGitHub}
            />
          </div>

          {/* Code Input Pane */}
          <div>
            <CodeInputPane
              code={code}
              setCode={setCode}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              framework={framework}
              setFramework={setFramework}
            />
          </div>

          {/* Suggestions Pane */}
          <div>
            <SuggestionsPane
              suggestions={componentSuggestions}
              isLoading={isLoading}
            />
          </div>

          {/* Output Pane */}
          <div>
            <OutputPane
              tailwindSuggestions={tailwindSuggestions}
              projectFiles={projectFiles}
              isLoading={isLoading}
              isEnhancing={isEnhancing}
              onEnhance={handleEnhance}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
