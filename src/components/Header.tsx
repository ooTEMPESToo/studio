'use client';

import { Icons } from './icons';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { HistoryPane } from './HistoryPane';
import { useSession, signIn, signOut } from 'next-auth/react';
import GitHubRepoPane from './GitHubRepoPane';

interface HeaderProps {
  history: string[];
  onLoadHistory: (code: string) => void;
  onDeleteHistory: (index: number) => void;
  onClearHistory: () => void;
  isLoading: boolean;
}

export function Header({
  history,
  onLoadHistory,
  onDeleteHistory,
  onClearHistory,
  isLoading,
}: HeaderProps) {
  const { data: session } = useSession();

  function handleCodeFromGitHub(code: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:px-6">
      {/* Left side: logo */}
      <div className="flex items-center gap-3">
        <Icons.logo className="h-6 w-6" />
        <h1 className="font-headline text-xl font-semibold tracking-tight text-foreground">
          ModernizeJS
        </h1>
      </div>

      {/* Right side: buttons */}
      <div className="flex items-center gap-3">
        {/* GitHub Authentication Section */}
        {session ? (
          <div className="flex items-center gap-2">
            <img
              src={session.user?.image ?? '/default-avatar.png'}
              alt="User Avatar"
              className="h-6 w-6 rounded-full"
            />
            <span className="text-sm">{session.user?.name ?? 'User'}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={() => signIn('github')}
          >
            Connect GitHub
          </Button>
        )}

        {/* History Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <History className="h-5 w-5" />
              <span className="sr-only">View History</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-md p-0 sm:max-w-lg">
            <GitHubRepoPane onLoadFile={(code) => handleCodeFromGitHub(code)} />
            <HistoryPane
              history={history}
              onLoadHistory={onLoadHistory}
              onDeleteHistory={onDeleteHistory}
              onClearHistory={onClearHistory}
              isLoading={isLoading}
            />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
