export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  description_ca: string | null;
  description_en: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface ProjectDraft {
  title: string;
  slug: string;
  description: string | null;
  description_ca: string | null;
  description_en: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
}

export function createProjectDraft(input: ProjectDraft): ProjectDraft {
  const title = input.title.trim();
  const slug = input.slug.trim();

  if (!title || !slug) {
    throw new Error("Título y slug son obligatorios");
  }

  return {
    ...input,
    title,
    slug,
  };
}

export function ensureProjectTitle(title: string): string {
  const cleanTitle = title.trim();

  if (!cleanTitle) {
    throw new Error("El títol és obligatori");
  }

  return cleanTitle;
}
