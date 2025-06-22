"use client";

import { Lightbulb } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Lightbulb className="w-8 h-8 text-primary" />
        <h1 className="ml-3 text-2xl font-bold font-headline tracking-tight">
          IdeaFlow AI
        </h1>
      </div>
    </header>
  );
}
