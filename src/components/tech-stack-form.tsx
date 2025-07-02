"use client";

import { recommendTechStack } from "@/ai/flows/recommend-tech-stack";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Layers, Loader2 } from "lucide-react";
import { useState, useEffect, type FormEvent, useCallback } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface TechStackFormProps {
  onComplete: (techStack: string[]) => void;
}

export function TechStackForm({ onComplete }: TechStackFormProps) {
  const [includeTechStack, setIncludeTechStack] = useState(true);
  const [techStacks, setTechStacks] = useState<string[]>([]);
  const [selectedStack, setSelectedStack] = useState<string>('');
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();

  const fetchTechStack = useCallback(async () => {
      setIsFetching(true);
      try {
          const result = await recommendTechStack({ applicationType: "web" });
          setTechStacks(result.techStacks);
          if (result.techStacks.length > 0) {
              setSelectedStack(result.techStacks[0]);
          }
      } catch (error) {
          console.error(error);
          toast({
              variant: "destructive",
              title: "AI Error",
              description: "Failed to fetch tech stack recommendations.",
          });
      } finally {
          setIsFetching(false);
      }
  }, [toast]);

  useEffect(() => {
    if (includeTechStack) {
      fetchTechStack();
    } else {
      setTechStacks([]);
      setSelectedStack('');
    }
  }, [includeTechStack, fetchTechStack]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (includeTechStack) {
      onComplete(selectedStack ? [selectedStack] : []);
    } else {
      onComplete([]);
    }
  };

  return (
    <Card className="w-full animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Technology Stack</CardTitle>
        <CardDescription>
          Optionally, get AI-powered tech stack recommendations for your web app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="tech-stack-switch" className="text-base font-medium">Include Tech Stack Suggestions</Label>
                    <p className="text-sm text-muted-foreground">Get AI recommendations for popular web technologies.</p>
                </div>
                <Switch
                    id="tech-stack-switch"
                    checked={includeTechStack}
                    onCheckedChange={setIncludeTechStack}
                />
            </div>
            
            {includeTechStack && (
                <div className="space-y-4 animate-in fade-in-50">
                    <h3 className="font-semibold text-lg">Select a Recommended Stack:</h3>
                    {isFetching ? (
                        <div className="grid gap-4 md:grid-cols-3">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    ) : (
                        <RadioGroup value={selectedStack} onValueChange={setSelectedStack} className="grid gap-4 md:grid-cols-3">
                             {techStacks.map((stack, index) => (
                                <div key={index}>
                                    <RadioGroupItem value={stack} id={`stack-${index}`} className="peer sr-only" />
                                    <Label 
                                        htmlFor={`stack-${index}`} 
                                        className={cn(
                                            "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                                            "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        )}
                                    >
                                        <Layers className="mb-3 h-6 w-6" />
                                        {stack}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                </div>
            )}
            
            <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={isFetching}>
                View Summary
                <ChevronRight className="ml-2" />
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}
