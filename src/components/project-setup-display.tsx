"use client";

import { generateProjectSetup } from "@/ai/flows/generate-project-setup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, FileCode, Rocket, Save, Loader2, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { saveProject } from "@/lib/actions";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { FileInput, FileText } from "lucide-react";

interface ProjectSetupDisplayProps {
  finalSummary: string;
  originalIdea: string;
  projectName: string;
}

export function ProjectSetupDisplay({ finalSummary, originalIdea, projectName: nameFromPrevStep }: ProjectSetupDisplayProps) {
    const [editableProjectName, setEditableProjectName] = useState(nameFromPrevStep);
    const [setupPromptContent, setSetupPromptContent] = useState('');
    const [fileStructure, setFileStructure] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        setEditableProjectName(nameFromPrevStep);
    }, [nameFromPrevStep]);

    useEffect(() => {
        const getSetup = async () => {
            if (!finalSummary || !nameFromPrevStep) return;
            setIsLoading(true);
            try {
                const setupResult = await generateProjectSetup({ finalSummary, projectName: nameFromPrevStep });
                setSetupPromptContent(setupResult.setupPromptContent);
                setFileStructure(setupResult.fileStructure);
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
    }, [finalSummary, nameFromPrevStep, toast]);

    const handleSave = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (!editableProjectName.trim()) {
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
                name: editableProjectName,
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
                    This is your final, shareable brief. Save it to your dashboard to access the feature prompt generator.
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
                    </div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="project-name" className="text-lg">Project Name</Label>
                             <div className="flex gap-2 items-center">
                                <Input
                                    id="project-name"
                                    value={editableProjectName}
                                    onChange={(e) => setEditableProjectName(e.target.value)}
                                    className="flex-grow font-headline text-lg"
                                />
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

                         <Accordion type="single" collapsible className="w-full pt-4 mt-4 border-t">
                            <AccordionItem value="original-idea">
                                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <FileInput className="h-5 w-5 text-primary"/>
                                        View Original Idea Input
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Textarea
                                        readOnly
                                        value={originalIdea}
                                        rows={10}
                                        className="font-mono text-sm bg-background/50"
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="full-plan" className="border-b-0">
                                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-primary"/>
                                        View Full Application Plan
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Textarea
                                        readOnly
                                        value={finalSummary}
                                        rows={20}
                                        className="font-mono text-sm bg-background/50"
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
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
