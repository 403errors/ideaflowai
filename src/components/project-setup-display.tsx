"use client";

import { generateProjectSetup } from "@/ai/flows/generate-project-setup";
import { generateProjectName } from "@/ai/flows/generate-project-name";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, FileCode, FolderTree, Rocket, Save, Loader2, LogIn, WandSparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { saveProject } from "@/lib/actions";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface ProjectSetupDisplayProps {
  finalSummary: string;
  originalIdea: string;
}

export function ProjectSetupDisplay({ finalSummary, originalIdea }: ProjectSetupDisplayProps) {
    const [projectName, setProjectName] = useState('');
    const [setupPromptContent, setSetupPromptContent] = useState('');
    const [fileStructure, setFileStructure] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingName, setIsGeneratingName] = useState(false);
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
    
    const handleGenerateName = async () => {
        setIsGeneratingName(true);
        try {
            const result = await generateProjectName({ summary: finalSummary });
            setProjectName(result.projectName);
            toast({ title: 'Name Generated!', description: 'A new creative name has been generated.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'AI Error', description: 'Could not generate a project name.' });
        } finally {
            setIsGeneratingName(false);
        }
    };

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
                originalIdea,
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
                         <Skeleton className="h-10 w-full" />
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
                             <div className="flex gap-2 items-center">
                                <Input
                                    id="project-name"
                                    placeholder="e.g., 'My Awesome Coffee Finder App'"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="flex-grow"
                                />
                                <Button type="button" onClick={handleGenerateName} disabled={isGeneratingName || isLoading}>
                                    {isGeneratingName ? <Loader2 className="mr-2 animate-spin" /> : <WandSparkles className="mr-2" />}
                                    Generate
                                </Button>
                            </div>
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
                    {isSaving ? 'Saving...' : (user ? 'Save Project & Generate Features' : 'Sign In to Save')}
                 </Button>
            </CardContent>
        </Card>
    );
}
