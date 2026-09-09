import type { Project } from "../domain/Project";

export interface SupabaseProjectRow {
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

export function toProject(row: SupabaseProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    description_ca: row.description_ca,
    description_en: row.description_en,
    cover_image_url: row.cover_image_url,
    is_featured: row.is_featured,
    display_order: row.display_order,
    created_at: row.created_at,
  };
}
