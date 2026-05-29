"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

export async function createProject(formData: FormData) {
  const supabase = createAdminClient();

  const title = (formData.get("title") as string).trim();
  const slug = ((formData.get("slug") as string) || slugify(title)).trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const description_ca = (formData.get("description_ca") as string)?.trim() || null;
  const description_en = (formData.get("description_en") as string)?.trim() || null;
  const is_featured = formData.get("is_featured") === "on";
  const cover_image_url = (formData.get("cover_image_url") as string)?.trim() || null;

  if (!title || !slug) throw new Error("Título y slug son obligatorios");

  const { error } = await supabase
    .from("projects")
    .insert({ title, slug, description, description_ca, description_en, is_featured, cover_image_url });

  if (error) {
    if (error.code === "23505") throw new Error(`El slug "${slug}" ya existe`);
    throw new Error(error.message);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function updateCoverImage(id: string, coverImageUrl: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("projects")
    .update({ cover_image_url: coverImageUrl })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/portfolio");
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("projects")
    .update({ is_featured: isFeatured })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = createAdminClient();

  const title = (formData.get("title") as string).trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const description_ca = (formData.get("description_ca") as string)?.trim() || null;
  const description_en = (formData.get("description_en") as string)?.trim() || null;

  if (!title) throw new Error("El títol és obligatori");

  const { error } = await supabase
    .from("projects")
    .update({ title, description, description_ca, description_en })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/portfolio");
}

export async function deleteProject(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  revalidatePath("/");
}
