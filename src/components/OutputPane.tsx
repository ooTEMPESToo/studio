import {
  File,
  Folder,
  ChevronsRight,
  FileCode,
  Download,
} from 'lucide-react';
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

interface OutputPaneProps {
  tailwindSuggestions: string;
  isLoading: boolean;
}

const FileTree = () => (
  <div className="space-y-2 font-code text-sm">
    <div className="flex items-center">
      <Folder className="mr-2 h-4 w-4 text-accent" />
      <span>components</span>
    </div>
    <div className="ml-4 flex items-center">
      <File className="mr-2 h-4 w-4 text-primary" />
      <span>Header.tsx</span>
    </div>
    <div className="ml-4 flex items-center">
      <File className="mr-2 h-4 w-4 text-primary" />
      <span>Button.tsx</span>
    </div>
    <div className="flex items-center">
      <Folder className="mr-2 h-4 w-4 text-accent" />
      <span>app</span>
    </div>
    <div className="ml-4 flex items-center">
      <File className="mr-2 h-4 w-4 text-primary" />
      <span>layout.tsx</span>
    </div>
    <div className="ml-4 flex items-center">
      <File className="mr-2 h-4 w-4 text-primary" />
      <span>page.tsx</span>
    </div>
    <div className="flex items-center">
      <FileCode className="mr-2 h-4 w-4" />
      <span>package.json</span>
    </div>
    <div className="flex items-center">
      <FileCode className="mr-2 h-4 w-4" />
      <span>tailwind.config.ts</span>
    </div>
  </div>
);

export function OutputPane({ tailwindSuggestions, isLoading }: OutputPaneProps) {
  return (
    <Card className="h-full">
      <Tabs defaultValue="tailwind" className="flex h-full flex-col">
        <div className="p-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tailwind">
              <ChevronsRight className="mr-2 h-4 w-4" /> Tailwind CSS
            </TabsTrigger>
            <TabsTrigger value="project">
              <FileCode className="mr-2 h-4 w-4" /> Project Structure
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
          className="flex flex-1 flex-col justify-between overflow-hidden p-4 pt-0"
        >
          <CardContent className="p-4">
            <h3 className="mb-4 font-semibold">
              Suggested Next.js Structure
            </h3>
            <FileTree />
          </CardContent>
          <div className="px-4 pb-4">
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Project
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
