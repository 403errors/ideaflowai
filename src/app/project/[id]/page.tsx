'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { getProject } from '@/lib/actions';
import type { Project } from '@/types';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { FeatureGenerationDisplay } from '@/components/feature-generation-display';
import { FileText, Info, Copy, FileInput } from 'lucide-react';
import { Card, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ProjectPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
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
        } else {
          // Handle project not found or access denied
          router.push('/dashboard');
        }
        setLoading(false);
      };
      fetchProject();
    }
  }, [user, projectId, router]);

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
    return null; // or a not found component
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
                <p className="mt-2 text-sm text-muted-foreground">
                  The original inputs and full application plan are collapsed at the bottom for your reference.
                </p>
            </div>
          </CardDescription>
        </Card>
        
        <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                  <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-xl flex items-center gap-3"><span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full h-8 w-8 text-sm font-mono">1</span>Setup Prompt</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(project.setupPrompt, 'Setup Prompt')}>
                          <Copy className="mr-2 h-4 w-4" /> Copy
                      </Button>
                  </div>
                  <Textarea
                      readOnly
                      value={project.setupPrompt}
                      rows={15}
                      className="font-mono text-sm bg-background/50"
                  />
              </div>
              
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
                <h3 className="font-semibold text-xl flex items-center gap-3 mb-2"><span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full h-8 w-8 text-sm font-mono">2</span>Feature Prompts</h3>
                <FeatureGenerationDisplay setupPrompt={project.setupPrompt} fileStructure={project.fileStructure} />
            </div>
        </div>
      </main>
    </div>
  );
}
