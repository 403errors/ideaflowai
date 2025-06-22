'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, User } from 'lucide-react';
import Image from 'next/image';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.344-11.303-7.962l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C41.38,36.148,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


export default function LoginPage() {
  const { user, signInWithGoogle, signInAnonymously, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                 <Lightbulb className="w-12 h-12 text-primary" />
            </div>
          <CardTitle className="font-headline text-3xl">Welcome to IdeaFlow AI</CardTitle>
          <CardDescription>Sign in to save your projects and continue your work.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={signInWithGoogle} className="w-full text-lg py-6" size="lg" disabled={loading}>
            <GoogleIcon />
            Sign in with Google
          </Button>
          <Button onClick={signInAnonymously} className="w-full text-lg py-6" variant="secondary" size="lg" disabled={loading}>
            <User className="mr-2" />
            Continue Anonymously
          </Button>
           <p className="text-xs text-center text-muted-foreground px-4">
            Anonymous accounts are temporary. Sign in with Google to save your work permanently.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
