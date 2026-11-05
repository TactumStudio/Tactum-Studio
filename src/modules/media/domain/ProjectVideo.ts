export interface ProjectVideo {
  id: string;
  project_id: string;
  url: string;
  title: string | null;
  display_order: number;
  created_at: string;
}

export interface ProjectVideoDraft {
  project_id: string;
  url: string;
  title: string | null;
}

export function createProjectVideoDraft(
  input: ProjectVideoDraft
): ProjectVideoDraft {
  const url = input.url.trim();

  if (!input.project_id || !url) {
    throw new Error("Projecte i URL del vídeo són obligatoris");
  }

  return {
    project_id: input.project_id,
    url,
    title: input.title?.trim() || null,
  };
}
