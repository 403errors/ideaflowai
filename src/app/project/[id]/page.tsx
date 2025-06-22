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
import { FileCode, FolderTree } from 'lucide-react';

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
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <Skeleton className="h-8 w-1/3 mb-4" />
                    <Skeleton className="h-64 w-full" />
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
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-2"><FileCode /> Setup Prompt</h3>
                    <Textarea
                        readOnly
                        value={project.setupPrompt}
                        rows={15}
                        className="font-mono text-sm bg-background/50"
                    />
                </div>
                <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-2"><FolderTree /> File Structure</h3>
                     <Textarea
                        readOnly
                        value={project.fileStructure}
                        rows={15}
                        className="font-mono text-sm bg-background/50"
                    />
                </div>
            </div>
            <div>
                <FeatureGenerationDisplay setupPrompt={project.setupPrompt} />
            </div>
        </div>
      </main>
    </div>
  );
}
