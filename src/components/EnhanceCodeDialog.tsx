'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { type TransformedFile } from '@/app/actions';

interface EnhanceCodeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fileToEnhance: TransformedFile | null;
  onEnhance: (file: TransformedFile, prompt: string) => void;
  isEnhancing: boolean;
}

export function EnhanceCodeDialog({
  isOpen,
  setIsOpen,
  fileToEnhance,
  onEnhance,
  isEnhancing,
}: EnhanceCodeDialogProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (fileToEnhance && prompt) {
      onEnhance(fileToEnhance, prompt);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Enhance Code with AI</DialogTitle>
          <DialogDescription>
            Tell the AI how you want to improve the code for{' '}
            <code className="font-semibold text-foreground">
              {fileToEnhance?.path}
            </code>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="enhancement-prompt">
              Enhancement Instructions
            </Label>
            <Textarea
              id="enhancement-prompt"
              placeholder="e.g., 'Add a dark mode switch' or 'Refactor this component to be more efficient'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isEnhancing || !prompt}
          >
            {isEnhancing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Enhance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
