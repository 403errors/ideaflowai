'use server';

import { collection, addDoc, getDocs, query, where, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Project } from '@/types';

interface ProjectData {
  userId: string;
  name: string;
  finalSummary: string;
  setupPrompt: string;
  fileStructure: string;
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
  
  const projects = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate()
    } as Project
  });

  return projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}


export async function getProject(projectId: string, userId: string): Promise<Project | null> {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const projectData = docSnap.data();
        if (projectData.userId === userId) {
            return {
                id: docSnap.id,
                ...projectData,
                createdAt: projectData.createdAt?.toDate(),
            } as Project;
        }
    }
    return null;
}
