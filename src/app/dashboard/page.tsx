
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { deleteProject, getProjects } from '@/lib/actions';
import type { Project } from '@/types';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, ArrowRight, Trash, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

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

  const extractSummary = (markdown: string): string => {
    if (!markdown) {
        return "No description available.";
    }
    const lines = markdown.split('\n');
    let firstParagraph = '';

    for (const line of lines) {
        const trimmed = line.trim();
        // Find the first line that is not a heading or list item.
        if (trimmed && !trimmed.startsWith('#') && !trimmed.match(/^\d+\./) && !trimmed.startsWith('* ') && !trimmed.startsWith('- ')) {
            firstParagraph = trimmed;
            break;
        }
    }

    // Fallback: If no prose paragraph is found, grab the first non-empty line and strip markdown.
    if (!firstParagraph) {
        const firstLine = lines.find(l => l.trim());
        if (firstLine) {
            firstParagraph = firstLine.replace(/^#+\s*/, '').replace(/^\d+\.\s*/, '').trim();
        }
    }

    return firstParagraph || "No description available.";
  };


  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete || !user) return;
    setIsDeleting(true);
    try {
      await deleteProject(projectToDelete.id, user.uid);
      setProjects(projects.filter((p) => p.id !== projectToDelete.id));
      toast({ title: 'Project deleted', description: `"${projectToDelete.name}" has been deleted.` });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete project.' });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

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
                           <Skeleton className="h-10 w-full" />
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
            <Link href="/create">
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
                      {extractSummary(project.finalSummary)}
                   </p>
                </CardContent>
                <CardFooter>
                  <div className='flex justify-between items-center w-full gap-2'>
                    <Button asChild className="w-full">
                      <Link href={`/project/${project.id}`}>
                        Open Project <ArrowRight className="ml-2" />
                      </Link>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(project)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete project</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold">No projects yet!</h2>
            <p className="text-muted-foreground mt-2 mb-6">Start a new project to see it here.</p>
            <Button asChild size="lg">
              <Link href="/create">
                <PlusCircle className="mr-2" />
                Create Your First Project
              </Link>
            </Button>
          </div>
        )}
      </main>

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              "{projectToDelete?.name}" and all of its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
