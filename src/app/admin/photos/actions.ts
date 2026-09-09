"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { AddProjectVideoHandler } from "@/modules/media/application/add-project-video/AddProjectVideoHandler";
import { DeletePhotoHandler } from "@/modules/media/application/delete-photo/DeletePhotoHandler";
import { DeleteProjectVideoHandler } from "@/modules/media/application/delete-project-video/DeleteProjectVideoHandler";
import { SavePhotoHandler } from "@/modules/media/application/save-photo/SavePhotoHandler";
import { UpdatePhotoOrderHandler } from "@/modules/media/application/update-photo-order/UpdatePhotoOrderHandler";
import { SupabaseMediaRepository } from "@/modules/media/infrastructure/SupabaseMediaRepository";

function mediaRepository() {
  return new SupabaseMediaRepository(createAdminClient());
}

export async function savePhoto(
  projectId: string,
  url: string,
  projectSlug: string,
  altText?: string
) {
  await new SavePhotoHandler(mediaRepository()).execute({
    projectId,
    url,
    altText,
  });

  revalidatePath("/admin/photos");
  revalidatePath(`/portfolio/${projectSlug}`);
}

export async function deletePhoto(id: string, projectSlug: string) {
  await new DeletePhotoHandler(mediaRepository()).execute(id);

  revalidatePath("/admin/photos");
  revalidatePath(`/portfolio/${projectSlug}`);
}

export async function updatePhotoOrder(
  photos: { id: string; display_order: number }[]
) {
  await new UpdatePhotoOrderHandler(mediaRepository()).execute(photos);

  revalidatePath("/admin/photos");
}

export async function addProjectVideo(
  projectId: string,
  url: string,
  title?: string,
  projectSlug?: string
) {
  await new AddProjectVideoHandler(mediaRepository()).execute({
    projectId,
    url,
    title,
  });

  revalidatePath("/admin/photos");
  if (projectSlug) revalidatePath(`/portfolio/${projectSlug}`);
}

export async function deleteProjectVideo(id: string, projectSlug?: string) {
  await new DeleteProjectVideoHandler(mediaRepository()).execute(id);

  revalidatePath("/admin/photos");
  if (projectSlug) revalidatePath(`/portfolio/${projectSlug}`);
}
