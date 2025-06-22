export interface Project {
  id: string;
  userId: string;
  name: string;
  finalSummary: string;
  setupPrompt: string;
  fileStructure: string;
  createdAt: Date;
}
