'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Wand2, Upload, Loader2, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CodeInputPaneProps {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

export function CodeInputPane({
  code,
  setCode,
  onAnalyze,
  isLoading,
}: CodeInputPaneProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const allFiles = Array.from(files);
      const filePromises = allFiles.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
              resolve(`/* --- File: ${file.name} --- */\n\n${text}\n\n`);
            } else {
              resolve('');
            }
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });
      });

      Promise.all(filePromises).then((fileContents) => {
        setCode(fileContents.join(''));
      });
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Legacy Code Input</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="code-input">
            Paste your HTML, CSS, or JS here, or upload files
          </Label>
          <Textarea
            id="code-input"
            placeholder="<html>...</html>"
            className="h-full min-h-[400px] flex-1 font-code text-sm"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isLoading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".html,.css,.js"
            multiple
          />
          <Button onClick={onAnalyze} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Analyze Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
