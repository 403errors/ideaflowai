
import { collection, addDoc, getDocs, query, where, doc, getDoc, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Project, Feature } from '@/types';

interface ProjectData {
  userId: string;
  name: string;
  originalIdea: string;
  finalSummary: string;
  setupPrompt: string;
  fileStructure: string;
  features: Feature[];
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
        originalIdea: data.originalIdea || '',
        finalSummary: data.finalSummary,
        setupPrompt: data.setupPrompt,
        fileStructure: data.fileStructure,
        createdAt: data.createdAt.toDate().toISOString(),
        features: data.features || [],
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
                originalIdea: projectData.originalIdea,
                finalSummary: projectData.finalSummary,
                setupPrompt: projectData.setupPrompt,
                fileStructure: projectData.fileStructure,
                createdAt: projectData.createdAt.toDate().toISOString(),
                features: projectData.features || [],
            } as Project;
        }
    }
    return null;
}

export async function deleteProject(projectId: string, userId: string): Promise<void> {
  const projectRef = doc(db, 'projects', projectId);
  const projectSnap = await getDoc(projectRef);

  if (!projectSnap.exists() || projectSnap.data().userId !== userId) {
    throw new Error("Project not found or you don't have permission to delete it.");
  }

  try {
    await deleteDoc(projectRef);
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete project.');
  }
}

export async function updateProjectFeatures(projectId: string, userId: string, features: Feature[]): Promise<void> {
    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists() || projectSnap.data().userId !== userId) {
        throw new Error("Project not found or you don't have permission to update it.");
    }
    
    try {
        await updateDoc(projectRef, { features });
    } catch (e) {
        console.error('Error updating document: ', e);
        throw new Error('Could not update project features.');
    }
}
