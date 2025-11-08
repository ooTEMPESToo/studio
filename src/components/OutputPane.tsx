import { useState } from 'react';
import { ChevronsRight, FileCode, Download, FileText } from 'lucide-react';
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

interface OutputPaneProps {
  tailwindSuggestions: string;
  projectFiles: TransformedFile[];
  isLoading: boolean;
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


export function OutputPane({ tailwindSuggestions, projectFiles, isLoading }: OutputPaneProps) {
  const [selectedFile, setSelectedFile] = useState<TransformedFile | null>(null);

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
              <ScrollArea className="h-full">
                <div className="p-4 font-code text-sm">
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
            </ResizablePanel>
          </ResizablePanelGroup>
          <div className="border-t p-4">
            <Button
              className="w-full"
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
  );
}
