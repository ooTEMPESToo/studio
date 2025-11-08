'use client';

import { History, Trash2, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryPaneProps {
  history: string[];
  onLoadHistory: (code: string) => void;
  onDeleteHistory: (index: number) => void;
  onClearHistory: () => void;
  isLoading: boolean;
}

export function HistoryPane({
  history,
  onLoadHistory,
  onDeleteHistory,
  onClearHistory,
  isLoading,
}: HistoryPaneProps) {
  return (
    <div className="flex h-full flex-col border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <CardTitle>History</CardTitle>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              disabled={isLoading}
              aria-label="Clear all history"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
        <CardDescription>
          Previously analyzed code snippets.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {history.length > 0 ? (
            <div className="space-y-2 pr-4">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between rounded-md border p-2 hover:bg-muted"
                >
                  <p className="truncate font-code text-sm">
                    {item.split('\n')[0] || 'Empty Snippet'}
                  </p>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onLoadHistory(item)}
                      disabled={isLoading}
                    >
                      Load
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive"
                      onClick={() => onDeleteHistory(index)}
                      disabled={isLoading}
                      aria-label="Delete history item"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center">
              <p className="text-center text-muted-foreground">
                Your analysis history will appear here.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </div>
  );
}
