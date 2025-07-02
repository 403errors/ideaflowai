export interface Feature {
  title: string;
  description: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  originalIdea: string;
  finalSummary: string;
  setupPrompt: string;
  fileStructure: string;
  createdAt: string;
  features?: Feature[];
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}
