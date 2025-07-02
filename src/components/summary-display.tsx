"use client";

import { generateFinalSummary } from "@/ai/flows/generate-final-summary";
import { generateProjectName } from "@/ai/flows/generate-project-name";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, PartyPopper, ChevronRight, WandSparkles, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SummaryDisplayProps {
  ideaSummary: string;
  answers: Record<string, string>;
  techStack: string[];
  onComplete: (summary: string, projectName: string) => void;
  addons: {
    auth: boolean;
    monetization: boolean;
  };
}

export function SummaryDisplay({ ideaSummary, answers, techStack, onComplete, addons }: SummaryDisplayProps) {
    const [summary, setSummary] = useState('');
    const [projectName, setProjectName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingName, setIsGeneratingName] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const createSummaryAndName = async () => {
            setIsLoading(true);
            try {
                const summaryResult = await generateFinalSummary({ 
                    ideaSummary, 
                    answers, 
                    techStack, 
                    includeAuth: addons.auth, 
                    includeMonetization: addons.monetization 
                });
                setSummary(summaryResult.finalSummary);
                
                // Automatically generate a name after the summary is created
                const nameResult = await generateProjectName({ summary: summaryResult.finalSummary });
                setProjectName(nameResult.projectName);

            } catch (error) {
                console.error("Error generating final summary:", error);
                toast({
                    variant: "destructive",
                    title: "AI Error",
                    description: "Could not generate the final summary. Please try again.",
                });
                setSummary("Failed to generate a detailed summary. Here's a basic outline:\n\n" + ideaSummary);
            } finally {
                setIsLoading(false);
            }
        };

        createSummaryAndName();
    }, [ideaSummary, answers, techStack, addons, toast]);

    const handleGenerateName = async () => {
        if (!summary) return;
        setIsGeneratingName(true);
        try {
            const result = await generateProjectName({ summary: summary });
            setProjectName(result.projectName);
            toast({ title: 'New Name Generated!', description: 'A new creative name has been suggested.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'AI Error', description: 'Could not generate a project name.' });
        } finally {
            setIsGeneratingName(false);
        }
    };

    const handleContinue = () => {
        if (!projectName.trim()) {
            toast({
                variant: 'destructive',
                title: 'Project Name Required',
                description: 'Please enter or generate a name for your project before continuing.'
            });
            return;
        }
        onComplete(summary, projectName);
    };

    return (
        <Card className="w-full animate-in fade-in-50">
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <PartyPopper className="w-16 h-16 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl text-center">Your Final App Plan</CardTitle>
                <CardDescription className="text-center">
                    The AI has synthesized your inputs into a complete plan. Name your project, then proceed to the final step.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                     <div className="space-y-6">
                         <Skeleton className="h-10 w-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-8 w-1/3 mb-2" />
                           <Skeleton className="h-40 w-full" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="project-name" className="text-lg">Project Name</Label>
                             <div className="flex gap-2 items-center">
                                <Input
                                    id="project-name"
                                    placeholder="e.g., 'My Awesome App'"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="flex-grow"
                                />
                                <Button type="button" onClick={handleGenerateName} disabled={isGeneratingName}>
                                    {isGeneratingName ? <Loader2 className="animate-spin" /> : <WandSparkles />}
                                    Generate
                                </Button>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="summary-editor" className="text-lg font-medium">Plan Summary (Editable)</Label>
                                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(summary)}>
                                    <Copy className="mr-2 h-4 w-4" /> Copy
                                </Button>
                            </div>
                            <Textarea
                                id="summary-editor"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                rows={15}
                                className="mt-2 font-mono text-sm bg-background/50"
                            />
                        </div>
                    </>
                )}
                <Button onClick={handleContinue} className="w-full" size="lg" disabled={isLoading}>
                    Next: Generate Development Brief
                    <ChevronRight className="ml-2" />
                </Button>
            </CardContent>
        </Card>
    );
}
