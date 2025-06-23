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
import { FileCode, FolderTree, FileText, Info, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
              <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                <li>Start by giving your AI developer the complete <strong>Setup Prompt</strong>. This provides the core context.</li>
                <li>Next, provide the <strong>File Structure</strong> to establish the project's architecture.</li>
                <li>Finally, use the <strong>Feature Prompts</strong> one by one, in order, to build your application step-by-step.</li>
              </ol>
            </div>
          </CardDescription>
        </Card>
        
        <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Tabs defaultValue="setup" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="setup"><FileCode />Setup Prompt</TabsTrigger>
                  <TabsTrigger value="structure"><FolderTree />File Structure</TabsTrigger>
                  <TabsTrigger value="plan"><FileText />Full Plan</TabsTrigger>
                </TabsList>
                
                <TabsContent value="setup" className="mt-4">
                   <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">Setup Prompt</h3>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(project.setupPrompt, 'Setup Prompt')}>
                      <Copy className="mr-2" /> Copy
                    </Button>
                  </div>
                  <Textarea
                    readOnly
                    value={project.setupPrompt}
                    rows={20}
                    className="font-mono text-sm bg-background/50"
                  />
                </TabsContent>

                <TabsContent value="structure" className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">File Structure</h3>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(project.fileStructure, 'File Structure')}>
                      <Copy className="mr-2" /> Copy
                    </Button>
                  </div>
                  <Textarea
                    readOnly
                    value={project.fileStructure}
                    rows={20}
                    className="font-mono text-sm bg-background/50"
                  />
                </TabsContent>

                <TabsContent value="plan" className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">Full Plan</h3>
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
                </TabsContent>
              </Tabs>
            </div>
            <div>
                <FeatureGenerationDisplay setupPrompt={project.setupPrompt} fileStructure={project.fileStructure} />
            </div>
        </div>
      </main>
    </div>
  );
}
