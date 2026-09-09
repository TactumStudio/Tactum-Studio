import { slugify } from "@/lib/utils";

export function buildProjectSlug(title: string, candidate?: string | null): string {
  const slug = candidate?.trim() || slugify(title);

  if (!slug) {
    throw new Error("Título y slug son obligatorios");
  }

  return slug;
}
