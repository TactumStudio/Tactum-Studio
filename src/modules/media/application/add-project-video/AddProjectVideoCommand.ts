export interface AddProjectVideoCommand {
  projectId: string;
  url: string;
  title?: string | null;
}
