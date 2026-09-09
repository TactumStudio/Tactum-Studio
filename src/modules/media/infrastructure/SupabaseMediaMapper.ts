import type { Photo } from "../domain/Photo";
import type { ProjectVideo } from "../domain/ProjectVideo";

export interface SupabasePhotoRow {
  id: string;
  project_id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

export interface SupabaseProjectVideoRow {
  id: string;
  project_id: string;
  url: string;
  title: string | null;
  display_order: number;
  created_at: string;
}

export function toPhoto(row: SupabasePhotoRow): Photo {
  return {
    id: row.id,
    project_id: row.project_id,
    url: row.url,
    alt_text: row.alt_text,
    display_order: row.display_order,
    created_at: row.created_at,
  };
}

export function toProjectVideo(row: SupabaseProjectVideoRow): ProjectVideo {
  return {
    id: row.id,
    project_id: row.project_id,
    url: row.url,
    title: row.title,
    display_order: row.display_order,
    created_at: row.created_at,
  };
}
