export interface Project {
  id: string;
  userId: string;
  name: string;
  finalSummary: string;
  setupPrompt: string;
  fileStructure: string;
  createdAt: string;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}
