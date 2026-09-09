"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { CreateProjectHandler } from "@/modules/projects/application/create-project/CreateProjectHandler";
import { DeleteProjectHandler } from "@/modules/projects/application/delete-project/DeleteProjectHandler";
import { ToggleFeaturedHandler } from "@/modules/projects/application/toggle-featured/ToggleFeaturedHandler";
import { UpdateCoverImageHandler } from "@/modules/projects/application/update-cover-image/UpdateCoverImageHandler";
import { UpdateProjectHandler } from "@/modules/projects/application/update-project/UpdateProjectHandler";
import { SupabaseProjectRepository } from "@/modules/projects/infrastructure/SupabaseProjectRepository";

function projectRepository() {
  return new SupabaseProjectRepository(createAdminClient());
}

export async function createProject(formData: FormData) {
  await new CreateProjectHandler(projectRepository()).execute({
    title: String(formData.get("title") ?? ""),
    slug: formData.get("slug") as string | null,
    description: formData.get("description") as string | null,
    description_ca: formData.get("description_ca") as string | null,
    description_en: formData.get("description_en") as string | null,
    cover_image_url: formData.get("cover_image_url") as string | null,
    is_featured: formData.get("is_featured") === "on",
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function updateCoverImage(id: string, coverImageUrl: string) {
  await new UpdateCoverImageHandler(projectRepository()).execute(id, coverImageUrl);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/portfolio");
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  await new ToggleFeaturedHandler(projectRepository()).execute(id, isFeatured);

  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function updateProject(id: string, formData: FormData) {
  await new UpdateProjectHandler(projectRepository()).execute(id, {
    title: String(formData.get("title") ?? ""),
    description: formData.get("description") as string | null,
    description_ca: formData.get("description_ca") as string | null,
    description_en: formData.get("description_en") as string | null,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/portfolio");
}

export async function deleteProject(id: string) {
  await new DeleteProjectHandler(projectRepository()).execute(id);

  revalidatePath("/admin/projects");
  revalidatePath("/");
}
