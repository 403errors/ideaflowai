'use server';

import { collection, addDoc, getDocs, query, where, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Project } from '@/types';

interface ProjectData {
  userId: string;
  name: string;
  finalSummary: string;
  setupPrompt: string;
  fileStructure: string;
}

export async function createUserProfile(user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null; }): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error creating user profile: ', e);
    }
  }
}

export async function saveProject(projectData: ProjectData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not save project.');
  }
}

export async function getProjects(userId: string): Promise<Project[]> {
  const projectsCol = collection(db, 'projects');
  const q = query(projectsCol, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  const projects: Project[] = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
        id: doc.id,
        userId: data.userId,
        name: data.name,
        finalSummary: data.finalSummary,
        setupPrompt: data.setupPrompt,
        fileStructure: data.fileStructure,
        createdAt: data.createdAt.toDate().toISOString(),
    }
  });

  return projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}


export async function getProject(projectId: string, userId: string): Promise<Project | null> {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const projectData = docSnap.data();
        if (projectData.userId === userId) {
            return {
                id: docSnap.id,
                userId: projectData.userId,
                name: projectData.name,
                finalSummary: projectData.finalSummary,
                setupPrompt: projectData.setupPrompt,
                fileStructure: projectData.fileStructure,
                createdAt: projectData.createdAt.toDate().toISOString(),
            } as Project;
        }
    }
    return null;
}
