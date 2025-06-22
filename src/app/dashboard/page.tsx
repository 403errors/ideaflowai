
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { getProjects } from '@/lib/actions';
import type { Project } from '@/types';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        setLoading(true);
        const userProjects = await getProjects(user.uid);
        setProjects(userProjects);
        setLoading(false);
      };
      fetchProjects();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-headline text-4xl font-bold">Your Projects</h1>
                <Skeleton className="h-10 w-36" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                        <CardFooter>
                           <Skeleton className="h-10 w-28" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-headline text-4xl font-bold">Your Projects</h1>
          <Button asChild>
            <Link href="/">
              <PlusCircle className="mr-2" />
              New Project
            </Link>
          </Button>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{project.name}</CardTitle>
                   <CardDescription>
                    Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                   <p className="text-muted-foreground line-clamp-3">
                      {project.finalSummary.split('## Goals')[0].replace('## Overview', '').trim()}
                   </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/project/${project.id}`}>
                      Open Project <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold">No projects yet!</h2>
            <p className="text-muted-foreground mt-2 mb-6">Start a new project to see it here.</p>
            <Button asChild size="lg">
              <Link href="/">
                <PlusCircle className="mr-2" />
                Create Your First Project
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
