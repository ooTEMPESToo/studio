'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Wand2, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Framework } from '@/app/page';

interface CodeInputPaneProps {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  onAnalyze: () => void;
  isLoading: boolean;
  framework: Framework;
  setFramework: Dispatch<SetStateAction<Framework>>;
}

export function CodeInputPane({
  code,
  setCode,
  onAnalyze,
  isLoading,
  framework,
  setFramework,
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

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Choose Target Framework</Label>
            <RadioGroup
              defaultValue="nextjs"
              className="flex gap-4"
              value={framework}
              onValueChange={(value: string) =>
                setFramework(value as Framework)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nextjs" id="nextjs" />
                <Label htmlFor="nextjs">Next.js</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="react" id="react" disabled />
                <Label htmlFor="react" className="text-muted-foreground">
                  React
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="angular" id="angular" disabled />
                <Label htmlFor="angular" className="text-muted-foreground">
                  Angular
                </Label>
              </div>
            </RadioGroup>
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
        </div>
      </CardContent>
    </Card>
  );
}