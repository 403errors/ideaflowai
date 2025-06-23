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
import { FileCode, FolderTree, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProjectPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

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
        <h1 className="font-headline text-4xl font-bold mb-8">{project.name}</h1>
        <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Tabs defaultValue="setup" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="setup"><FileCode />Setup Prompt</TabsTrigger>
                  <TabsTrigger value="structure"><FolderTree />File Structure</TabsTrigger>
                  <TabsTrigger value="plan"><FileText />Full Plan</TabsTrigger>
                </TabsList>
                <TabsContent value="setup">
                  <Textarea
                    readOnly
                    value={project.setupPrompt}
                    rows={20}
                    className="font-mono text-sm bg-background/50 mt-2"
                  />
                </TabsContent>
                <TabsContent value="structure">
                  <Textarea
                    readOnly
                    value={project.fileStructure}
                    rows={20}
                    className="font-mono text-sm bg-background/50 mt-2"
                  />
                </TabsContent>
                <TabsContent value="plan">
                   <Textarea
                    readOnly
                    value={project.finalSummary}
                    rows={20}
                    className="font-mono text-sm bg-background/50 mt-2"
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
