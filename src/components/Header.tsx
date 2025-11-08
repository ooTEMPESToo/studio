import { Icons } from './icons';

export function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-background/95 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <Icons.logo className="h-6 w-6" />
        <h1 className="font-headline text-xl font-semibold tracking-tight text-foreground">
          ModernizeJS
        </h1>
      </div>
    </header>
  );
}
