"use client";

import { generateProjectSetup } from "@/ai/flows/generate-project-setup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, FileCode, FolderTree, Rocket, Save, Loader2, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { saveProject } from "@/lib/actions";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface ProjectSetupDisplayProps {
  finalSummary: string;
}

export function ProjectSetupDisplay({ finalSummary }: ProjectSetupDisplayProps) {
    const [projectName, setProjectName] = useState('');
    const [setupPromptContent, setSetupPromptContent] = useState('');
    const [fileStructure, setFileStructure] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const getSetup = async () => {
            if (!finalSummary) return;
            setIsLoading(true);
            try {
                const result = await generateProjectSetup({ finalSummary });
                setSetupPromptContent(result.setupPromptContent);
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
    
    const handleSave = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (!projectName.trim()) {
            toast({
                variant: 'destructive',
                title: 'Project Name Required',
                description: 'Please enter a name for your project.'
            });
            return;
        }

        setIsSaving(true);
        try {
            const newProjectId = await saveProject({
                userId: user.uid,
                name: projectName,
                finalSummary,
                setupPrompt: setupPromptContent,
                fileStructure,
            });
            toast({
                title: 'Project Saved!',
                description: 'Your project has been successfully saved.'
            });
            router.push(`/project/${newProjectId}`);
        } catch (error) {
             console.error("Error saving project:", error);
            toast({
                variant: "destructive",
                title: "Save Error",
                description: "Could not save your project. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };


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
                <CardTitle className="font-headline text-3xl text-center">Your Development Brief</CardTitle>
                <CardDescription className="text-center">
                    Here is the final plan. Give your project a name, save it, and start generating feature prompts.
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
                        <div className="space-y-2">
                            <Label htmlFor="project-name" className="text-lg">Project Name</Label>
                             <Input
                                id="project-name"
                                placeholder="e.g., 'My Awesome Coffee Finder App'"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold flex items-center gap-2"><FileCode /> Setup Prompt</h3>
                                <Button variant="ghost" size="sm" onClick={() => handleCopy(setupPromptContent, "Setup Prompt")}>
                                    <Copy className="mr-2 h-4 w-4" /> Copy
                                </Button>
                            </div>
                            <Textarea
                                value={setupPromptContent}
                                readOnly
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
                                readOnly
                                rows={15}
                                className="font-mono text-sm bg-background/50"
                            />
                        </div>
                    </>
                )}
                 <Button onClick={handleSave} className="w-full text-lg py-6" size="lg" disabled={isLoading || isSaving}>
                    {isSaving ? (
                        <Loader2 className="mr-2 animate-spin" />
                    ) : user ? (
                        <Save className="mr-2" />
                    ) : (
                        <LogIn className="mr-2" />
                    )}
                    {isSaving ? 'Saving...' : (user ? 'Save Project & Continue' : 'Sign In to Save')}
                 </Button>
            </CardContent>
        </Card>
    );
}
