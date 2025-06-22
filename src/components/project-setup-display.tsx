"use client";

import { generateProjectSetup } from "@/ai/flows/generate-project-setup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, FileCode, FolderTree, Rocket, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface ProjectSetupDisplayProps {
  finalSummary: string;
}

export function ProjectSetupDisplay({ finalSummary }: ProjectSetupDisplayProps) {
    const [readmeContent, setReadmeContent] = useState('');
    const [fileStructure, setFileStructure] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const getSetup = async () => {
            if (!finalSummary) return;
            setIsLoading(true);
            try {
                const result = await generateProjectSetup({ finalSummary });
                setReadmeContent(result.readmeContent);
                setFileStructure(result.fileStructure);
            } catch (error) {
                console.error("Error generating project setup:", error);
                toast({
                    variant: "destructive",
                    title: "AI Error",
                    description: "Could not generate the project setup. Please try again.",
                });
            } finally {
                setIsLoading(false);
            }
        };

        getSetup();
    }, [finalSummary, toast]);

    const handleCopy = (content: string, type: string) => {
        if (!content) return;
        navigator.clipboard.writeText(content);
        toast({
            title: `Copied ${type} to clipboard!`,
        });
    };

    return (
        <Card className="w-full animate-in fade-in-50">
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <Rocket className="w-16 h-16 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl text-center">Project Setup</CardTitle>
                <CardDescription className="text-center">
                    Here's a recommended project setup. Next, you can generate code for each feature.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {isLoading ? (
                    <div className="space-y-6">
                        <div className="space-y-2">
                           <Skeleton className="h-8 w-1/3 mb-2" />
                           <Skeleton className="h-40 w-full" />
                        </div>
                         <div className="space-y-2">
                           <Skeleton className="h-8 w-1/3 mb-2" />
                           <Skeleton className="h-40 w-full" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold flex items-center gap-2"><FileCode /> README.md</h3>
                                <Button variant="ghost" size="sm" onClick={() => handleCopy(readmeContent, "README")}>
                                    <Copy className="mr-2 h-4 w-4" /> Copy
                                </Button>
                            </div>
                            <Textarea
                                value={readmeContent}
                                onChange={(e) => setReadmeContent(e.target.value)}
                                rows={15}
                                className="font-mono text-sm bg-background/50"
                            />
                        </div>
                         <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold flex items-center gap-2"><FolderTree /> File Structure</h3>
                                <Button variant="ghost" size="sm" onClick={() => handleCopy(fileStructure, "File Structure")}>
                                    <Copy className="mr-2 h-4 w-4" /> Copy
                                </Button>
                            </div>
                            <Textarea
                                value={fileStructure}
                                onChange={(e) => setFileStructure(e.target.value)}
                                rows={15}
                                className="font-mono text-sm bg-background/50"
                            />
                        </div>
                    </>
                )}
                 <Button onClick={() => toast({ title: "Coming Soon!", description: "Feature-by-feature sequential prompt generation is next."})} className="w-full text-lg py-6" size="lg" disabled={isLoading}>
                    Next: Generate Features Sequentially
                    <ChevronRight className="ml-2" />
                 </Button>
            </CardContent>
        </Card>
    );
}
