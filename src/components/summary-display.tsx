"use client";

import { generateFinalSummary } from "@/ai/flows/generate-final-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";

interface SummaryDisplayProps {
  ideaSummary: string;
  answers: Record<string, string>;
  techStack: string[];
}

export function SummaryDisplay({ ideaSummary, answers, techStack }: SummaryDisplayProps) {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const createSummary = async () => {
            setIsLoading(true);
            try {
                const result = await generateFinalSummary({ ideaSummary, answers, techStack });
                setSummary(result.finalSummary);
            } catch (error) {
                console.error("Error generating final summary:", error);
                toast({
                    variant: "destructive",
                    title: "AI Error",
                    description: "Could not generate the final summary. Please try again.",
                });
                // Fallback to a simple summary
                setSummary("Failed to generate a detailed summary. Here's a basic outline:\n\n" + ideaSummary);
            } finally {
                setIsLoading(false);
            }
        };

        createSummary();
    }, [ideaSummary, answers, techStack, toast]);

    const handleCopy = () => {
        if (!summary) return;
        navigator.clipboard.writeText(summary);
        toast({
            title: "Copied to clipboard!",
            description: "Your application plan is ready to be shared.",
        });
    };

    return (
        <Card className="w-full animate-in fade-in-50">
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <PartyPopper className="w-16 h-16 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl text-center">Your Final App Plan</CardTitle>
                <CardDescription className="text-center">
                    The AI has synthesized your inputs into a complete plan. You can edit it below or copy it to your clipboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-4/5" />
                        </div>
                         <Skeleton className="h-40 w-full" />
                    </div>
                ) : (
                    <div>
                        <Label htmlFor="summary-editor" className="text-lg font-medium">Plan Summary (Editable)</Label>
                        <Textarea
                            id="summary-editor"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={20}
                            className="mt-2 font-mono text-sm bg-background/50"
                        />
                    </div>
                )}
                <Button onClick={handleCopy} className="w-full text-lg py-6" size="lg" disabled={isLoading}>
                    <Copy className="mr-2" />
                    Copy Plan
                </Button>
            </CardContent>
        </Card>
    );
}
