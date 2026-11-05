export interface Photo {
  id: string;
  project_id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

export interface PhotoDraft {
  project_id: string;
  url: string;
  alt_text: string | null;
}

export interface PhotoOrder {
  id: string;
  display_order: number;
}

export function createPhotoDraft(input: PhotoDraft): PhotoDraft {
  const url = input.url.trim();

  if (!input.project_id || !url) {
    throw new Error("Projecte i URL de la foto són obligatoris");
  }

  return {
    project_id: input.project_id,
    url,
    alt_text: input.alt_text?.trim() || null,
  };
}
