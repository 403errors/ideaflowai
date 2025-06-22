'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInAnonymously as firebaseSignInAnonymously, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { createUserProfile } from '@/lib/actions';
import type { AppUser } from '@/types';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfileData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
        };
        await createUserProfile(userProfileData);

        const appUser: AppUser = {
          ...userProfileData,
          isAnonymous: firebaseUser.isAnonymous,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setLoading(false);
    }
  }, [router]);

  const signInAnonymously = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseSignInAnonymously(auth);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      setLoading(false);
    }
  }, [router]);


  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    router.push('/login');
  }, [router]);

  const value = useMemo(() => ({
    user,
    loading,
    signInWithGoogle,
    signInAnonymously,
    signOut,
  }), [user, loading, signInWithGoogle, signInAnonymously, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
