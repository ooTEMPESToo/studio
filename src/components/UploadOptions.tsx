'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSession, signIn } from 'next-auth/react';
import GitHubRepoPane from './GitHubRepoPane';

interface UploadOptionsProps {
  onUploadFromComputer: (file: File) => void;
  onLoadFromGitHub: (code: string) => void;
}

export default function UploadOptions({ onUploadFromComputer, onLoadFromGitHub }: UploadOptionsProps) {
  const [isGitHubOpen, setIsGitHubOpen] = useState(false);
  const { data: session } = useSession();

  // Handle local file upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFromComputer(file);
    }
  };

  // Handle GitHub option
  const handleGitHubUpload = () => {
    if (!session) {
      signIn('github'); // Redirect to GitHub login
      return;
    }
    setIsGitHubOpen(true);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Upload Project</Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Select Upload Source</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-3">
          {/* Upload from computer */}
          <Button asChild>
            <label className="cursor-pointer w-full">
              Upload from Computer
              <input
                type="file"
                accept=".zip,.js,.html,.css,.json,.txt"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </Button>

          {/* Upload from GitHub */}
          <Button variant="outline" onClick={handleGitHubUpload}>
            Upload from GitHub
          </Button>
        </div>
      </DialogContent>

      {/* GitHub Repo Pane */}
      {isGitHubOpen && (
        <GitHubRepoPane
          onLoadFile={(code) => {
            onLoadFromGitHub(code);
            setIsGitHubOpen(false);
          }}
        />
      )}
    </Dialog>
  );
}
