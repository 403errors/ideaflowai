"use client";

import { useAuth } from "@/contexts/auth-context";
import { Lightbulb } from "lucide-react";
import Link from "next/link";
import { UserNav } from "./user-nav";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export function AppHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
            <Lightbulb className="w-8 h-8 text-primary" />
            <h1 className="ml-3 text-2xl font-bold font-headline tracking-tight">
            IdeaFlowAI
            </h1>
        </Link>
        
        <div>
          {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <UserNav user={user} />
          ) : (
            <Button asChild>
                <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
