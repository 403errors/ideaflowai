'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { getProject, updateProjectFeatures } from '@/lib/actions';
import { extractFeatures } from '@/ai/flows/extract-features';
import type { Project, Feature } from '@/types';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { FeatureGenerationDisplay } from '@/components/feature-generation-display';
import { FileText, Info, Copy, FileInput, RefreshCcw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function ProjectPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReinitializing, setIsReinitializing] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && projectId) {
      const fetchProject = async () => {
        setLoading(true);
        const fetchedProject = await getProject(projectId, user.uid);
        if (fetchedProject) {
          setProject(fetchedProject);
          setFeatures(fetchedProject.features || []);
        } else {
          router.push('/dashboard');
        }
        setLoading(false);
      };
      fetchProject();
    }
  }, [user, projectId, router]);
  
  const handleReinitialize = async () => {
    if (!project || !user) return;
    
    setIsReinitializing(true);
    setIsAlertOpen(false);
    
    try {
        const { features: newFeatures } = await extractFeatures({ setupPrompt: project.setupPrompt });
        await updateProjectFeatures(project.id, user.uid, newFeatures);
        setFeatures(newFeatures);
        toast({ title: 'Features Re-initialized!', description: 'The feature list has been updated.' });
    } catch (error) {
        console.error("Error re-initializing features:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to re-initialize features.' });
    } finally {
        setIsReinitializing(false);
    }
  };

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    toast({
        title: `Copied ${type} to clipboard!`,
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
            <Skeleton className="h-10 w-3/4 mb-8" />
            <div className="grid lg:grid-cols-2 gap-12">
                <div>
                    <Skeleton className="h-10 w-full mb-2" />
                    <Skeleton className="h-96 w-full" />
                </div>
                <div>
                     <Skeleton className="h-8 w-1/3 mb-4" />
                     <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <h1 className="font-headline text-4xl font-bold mb-4">{project.name}</h1>
        <Card className="mb-8 bg-secondary/50 border-primary/20">
          <CardDescription className="p-4 flex gap-4 items-start">
            <Info className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-semibold text-foreground mb-1">How to Use Your Development Brief</h2>
               <p>
                  Your project has been organized into a sequential brief for an AI developer. Follow the steps below:
                </p>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Use the <strong>Setup Prompt</strong> to give the AI the core context of your application.</li>
                    <li>Use the <strong>Feature Generation</strong> panel to build your app step-by-step.</li>
                </ol>
            </div>
          </CardDescription>
        </Card>
        
        <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-3"><span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full h-8 w-8 text-sm font-mono">1</span>Setup Prompt</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(project.setupPrompt, 'Setup Prompt')}>
                          <Copy className="mr-2 h-4 w-4" /> Copy
                      </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                      readOnly
                      value={project.setupPrompt}
                      rows={15}
                      className="font-mono text-sm bg-background/50"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Advanced Options</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" onClick={() => setIsAlertOpen(true)} disabled={isReinitializing}>
                        {isReinitializing ? (
                            <Loader2 className="mr-2 animate-spin" />
                        ) : (
                            <RefreshCcw className="mr-2" />
                        )}
                        {isReinitializing ? "Processing..." : "Re-initialize Features"}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                        If you've edited your Setup Prompt, you can regenerate the feature list. This action is permanent.
                    </p>
                </CardContent>
              </Card>
              
              <Accordion type="single" collapsible className="w-full pt-8 mt-8 border-t">
                  <AccordionItem value="original-idea">
                      <AccordionTrigger className="text-base font-semibold hover:no-underline">
                         <div className="flex items-center gap-3">
                              <FileInput className="h-5 w-5 text-primary"/>
                              View Original Idea Input
                          </div>
                      </AccordionTrigger>
                      <AccordionContent>
                           <div className="flex items-center justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleCopy(project.originalIdea, 'Original Idea')}>
                                  <Copy className="mr-2" /> Copy
                              </Button>
                          </div>
                          <Textarea
                              readOnly
                              value={project.originalIdea}
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
                           <div className="flex items-center justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleCopy(project.finalSummary, 'Full Plan')}>
                                  <Copy className="mr-2" /> Copy
                              </Button>
                          </div>
                          <Textarea
                              readOnly
                              value={project.finalSummary}
                              rows={20}
                              className="font-mono text-sm bg-background/50"
                          />
                      </AccordionContent>
                  </AccordionItem>
              </Accordion>
          </div>
            <div>
                 <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full h-8 w-8 text-sm font-mono">2</span>
                    <h3 className="font-semibold text-xl">Feature Prompts</h3>
                </div>
                <FeatureGenerationDisplay setupPrompt={project.setupPrompt} fileStructure={project.fileStructure} features={features} />
            </div>
        </div>
      </main>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will re-analyze your setup prompt and generate a new list of features. Any existing generated feature prompts will be hidden. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReinitialize}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
