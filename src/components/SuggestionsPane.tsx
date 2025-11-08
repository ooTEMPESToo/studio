import { marked } from 'marked';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface SuggestionsPaneProps {
  suggestions: string;
  isLoading: boolean;
}

export function SuggestionsPane({
  suggestions,
  isLoading,
}: SuggestionsPaneProps) {

  const getMarkdownText = () => {
    const rawMarkup = marked.parse(suggestions);
    return { __html: rawMarkup };
  };
  
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>React Component Suggestions</CardTitle>
        <CardDescription>
          AI-powered recommendations for structuring your components.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="prose prose-sm dark:prose-invert max-w-none pr-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <div className="pt-4">
                  <Skeleton className="h-8 w-2/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ) : suggestions ? (
              <div
                className="font-code"
                dangerouslySetInnerHTML={getMarkdownText()}
              />
            ) : (
              <div className="flex h-full min-h-[200px] items-center justify-center">
                <p className="text-muted-foreground">
                  Analysis results will appear here.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
