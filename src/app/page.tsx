
"use client";

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Bot, FileCode, Lightbulb, Sparkles, Wand } from 'lucide-react';


const LoadingScreen = () => (
    <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
            <div className="w-full max-w-4xl space-y-8">
                <Skeleton className="h-32 w-full" />
                <div className="grid md:grid-cols-3 gap-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </main>
    </div>
);


export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If done loading and we have a user, redirect to their dashboard
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // While checking auth state, show a loader
  if (loading) {
    return <LoadingScreen />;
  }

  // If there's a user, we're in the process of redirecting. Show a loader.
  if (user) {
    return <LoadingScreen />;
  }

  // Otherwise, show the landing page for logged-out users
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 text-center bg-gradient-to-b from-background to-secondary/50">
            <div className="bg-primary/20 text-primary font-bold py-1 px-4 rounded-full inline-block mb-4">
                Powered by Generative AI
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight max-w-5xl mx-auto px-4">
                Turn Your Spark of an Idea into a Fully-Planned Application
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 px-4">
                IdeaFlowAI guides you from a raw concept to a complete, developer-ready plan with AI-powered refinement, technical planning, and prompt generation.
            </p>
            <Button size="lg" asChild>
              <Link href="/login">
                Get Started for Free <ArrowRight className="ml-2" />
              </Link>
            </Button>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center font-headline mb-12">
              Why IdeaFlowAI?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4">Idea Extraction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Simply describe your idea in plain text, or upload an image or PDF. Our AI distills the core concept instantly.
                  </p>
                </CardContent>
              </Card>
               <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4">Guided Refinement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Engage in a conversation with our AI product manager to refine your idea, select features, and define the user flow.
                  </p>
                </CardContent>
              </Card>
               <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <FileCode className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4">Technical Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Receive a comprehensive development plan, including a setup prompt and a recommended file structure for your project.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <Wand className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4">Prompt Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Generate detailed, sequential engineering prompts for each feature, ready for an AI developer to start coding.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                 <h2 className="text-3xl md:text-4xl font-bold text-center font-headline mb-12">
                    How It Works
                </h2>
                <div className="relative">
                    {/* The connecting line */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                    <div className="grid md:grid-cols-3 gap-16 relative">
                        <div className="text-center">
                            <div className="relative inline-block">
                                <div className="w-16 h-16 bg-background border-2 border-primary rounded-full flex items-center justify-center text-primary text-2xl font-bold font-headline">1</div>
                            </div>
                            <h3 className="font-headline text-xl font-semibold mt-4 mb-2">Submit Your Idea</h3>
                            <p className="text-muted-foreground">Provide your app concept in any format. Our AI gets to work understanding your vision.</p>
                        </div>
                         <div className="text-center">
                             <div className="relative inline-block">
                                <div className="w-16 h-16 bg-background border-2 border-primary rounded-full flex items-center justify-center text-primary text-2xl font-bold font-headline">2</div>
                            </div>
                            <h3 className="font-headline text-xl font-semibold mt-4 mb-2">Refine with AI</h3>
                            <p className="text-muted-foreground">Answer a series of smart, multiple-choice questions to build out your app's features and flow.</p>
                        </div>
                         <div className="text-center">
                            <div className="relative inline-block">
                                <div className="w-16 h-16 bg-background border-2 border-primary rounded-full flex items-center justify-center text-primary text-2xl font-bold font-headline">3</div>
                            </div>
                            <h3 className="font-headline text-xl font-semibold mt-4 mb-2">Launch Your Plan</h3>
                            <p className="text-muted-foreground">Save your final development plan and start generating detailed prompts for your AI coder.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        {/* Final CTA */}
        <section className="py-20 md:py-32 text-center">
            <div className="container mx-auto px-4">
                <Lightbulb className="h-16 w-16 text-primary mx-auto mb-4"/>
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
                    Ready to build your masterpiece?
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                   Stop dreaming and start planning. Bring your app idea to life today.
                </p>
                <Button size="lg" asChild className="text-lg py-7">
                    <Link href="/login">
                        Start Your Project Now
                    </Link>
                </Button>
            </div>
        </section>

      </main>
      <footer className="py-6 border-t">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} IdeaFlowAI. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
}
