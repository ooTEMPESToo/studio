import { useState, useEffect } from 'react';
import { ChevronsRight, FileCode, Download, FileText, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { type TransformedFile } from '@/app/actions';
import { cn } from '@/lib/utils';
import JSZip from 'jszip';
import { EnhanceCodeDialog } from './EnhanceCodeDialog';

interface OutputPaneProps {
  tailwindSuggestions: string;
  projectFiles: TransformedFile[];
  isLoading: boolean;
  isEnhancing: boolean;
  onEnhance: (file: TransformedFile, prompt: string) => void;
}

interface FileTreeProps {
  files: TransformedFile[];
  selectedFile: TransformedFile | null;
  onSelectFile: (file: TransformedFile) => void;
  isLoading: boolean;
}

const FileTree = ({ files, selectedFile, onSelectFile, isLoading }: FileTreeProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-5/6" />
      </div>
    );
  }

  if (!files.length) {
    return (
       <div className="flex h-full min-h-[200px] items-center justify-center p-4">
        <p className="text-center text-muted-foreground">
          Project structure will appear here after analysis.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-1 p-2 font-code text-sm">
      {files.map((file) => (
        <button
          key={file.path}
          onClick={() => onSelectFile(file)}
          className={cn(
            'flex w-full items-center rounded-md px-2 py-1 text-left hover:bg-muted',
            selectedFile?.path === file.path && 'bg-muted'
          )}
        >
          <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{file.path}</span>
        </button>
      ))}
    </div>
  );
};


export function OutputPane({ tailwindSuggestions, projectFiles, isLoading, isEnhancing, onEnhance }: OutputPaneProps) {
  const [selectedFile, setSelectedFile] = useState<TransformedFile | null>(null);
  const [isEnhanceDialogOpen, setIsEnhanceDialogOpen] = useState(false);

  useEffect(() => {
    // If project files are updated, select the first file by default
    if (projectFiles.length > 0 && !selectedFile) {
      setSelectedFile(projectFiles[0]);
    }
    // If the selected file is no longer in the project files, deselect it
    if (selectedFile && !projectFiles.find(f => f.path === selectedFile.path)) {
      setSelectedFile(projectFiles[0] || null);
    }
  }, [projectFiles, selectedFile]);
  
  // When an enhancement is complete, close the dialog
  useEffect(() => {
    if (!isEnhancing) {
      setIsEnhanceDialogOpen(false);
    }
  }, [isEnhancing]);

  const handleSelectFile = (file: TransformedFile) => {
    setSelectedFile(file);
  }
  
  const handleDownload = () => {
    const zip = new JSZip();
    projectFiles.forEach((file) => {
      zip.file(file.path, file.content);
    });
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'modernized-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <>
    <Card className="h-full">
      <Tabs defaultValue="project" className="flex h-full flex-col">
        <div className="p-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="project">
              <FileCode className="mr-2 h-4 w-4" /> Project
            </TabsTrigger>
            <TabsTrigger value="tailwind">
              <ChevronsRight className="mr-2 h-4 w-4" /> Tailwind
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="tailwind" className="flex-1 overflow-hidden p-4 pt-0">
          <ScrollArea className="h-full">
            <div className="pr-4">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : tailwindSuggestions ? (
                <pre className="whitespace-pre-wrap font-code text-sm">
                  <code>{tailwindSuggestions}</code>
                </pre>
              ) : (
                <div className="flex h-full min-h-[200px] items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    Tailwind CSS suggestions will appear here.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent
          value="project"
          className="flex flex-1 flex-col overflow-hidden pt-0"
        >
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={40} minSize={30}>
              <ScrollArea className="h-full">
                <FileTree
                  files={projectFiles}
                  selectedFile={selectedFile}
                  onSelectFile={handleSelectFile}
                  isLoading={isLoading}
                />
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60} minSize={40}>
              <div className="relative h-full">
                <ScrollArea className="h-full">
                  <div className="p-4 font-code text-sm">
                    {isEnhancing && selectedFile ? (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                        <Loader2 className="mb-2 h-8 w-8 animate-spin" />
                        <p className="text-sm text-muted-foreground">Enhancing code...</p>
                      </div>
                    ) : null}
                    {selectedFile ? (
                       <pre className="whitespace-pre-wrap">
                        <code>{selectedFile.content}</code>
                      </pre>
                    ) : (
                      <div className="flex h-full min-h-[300px] items-center justify-center">
                         <p className="text-center text-muted-foreground">
                          {isLoading ? 'Loading file...' : 'Select a file to view its content'}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
          <div className="flex items-center justify-between gap-2 border-t p-4">
             <Button
              variant="outline"
              onClick={() => setIsEnhanceDialogOpen(true)}
              disabled={isLoading || isEnhancing || !selectedFile}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Enhance
            </Button>
            <Button
              className="flex-1"
              disabled={isLoading || projectFiles.length === 0}
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Project
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
    <EnhanceCodeDialog
        isOpen={isEnhanceDialogOpen}
        setIsOpen={setIsEnhanceDialogOpen}
        fileToEnhance={selectedFile}
        onEnhance={onEnhance}
        isEnhancing={isEnhancing}
      />
    </>
  );
}
