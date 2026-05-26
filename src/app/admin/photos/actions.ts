"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function savePhoto(
  projectId: string,
  url: string,
  altText?: string
) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("photos").insert({
    project_id: projectId,
    url,
    alt_text: altText ?? null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/photos");
  revalidatePath(`/portfolio/${projectId}`);
}

export async function deletePhoto(id: string, projectSlug: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("photos").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/photos");
  revalidatePath(`/portfolio/${projectSlug}`);
}

export async function updatePhotoOrder(
  photos: { id: string; display_order: number }[]
) {
  const supabase = createAdminClient();

  await Promise.all(
    photos.map(({ id, display_order }) =>
      supabase.from("photos").update({ display_order }).eq("id", id)
    )
  );

  revalidatePath("/admin/photos");
}
