export interface CreateProjectCommand {
  title: string;
  slug?: string | null;
  description?: string | null;
  description_ca?: string | null;
  description_en?: string | null;
  cover_image_url?: string | null;
  is_featured: boolean;
}
