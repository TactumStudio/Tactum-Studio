import { createAdminClient } from "@/lib/supabase/admin";
import type { Photo } from "../domain/Photo";
import type { ProjectVideo } from "../domain/ProjectVideo";
import {
  toPhoto,
  toProjectVideo,
  type SupabasePhotoRow,
  type SupabaseProjectVideoRow,
} from "./SupabaseMediaMapper";

export async function listProjectMedia(projectId: string): Promise<{
  photos: Photo[];
  videos: ProjectVideo[];
}> {
  const supabase = createAdminClient();

  const [{ data: photos }, { data: videos }] = await Promise.all([
    supabase
      .from("photos")
      .select("*")
      .eq("project_id", projectId)
      .order("display_order", { ascending: true }),
    supabase
      .from("project_videos")
      .select("*")
      .eq("project_id", projectId)
      .order("display_order", { ascending: true }),
  ]);

  return {
    photos: ((photos as SupabasePhotoRow[] | null) ?? []).map(toPhoto),
    videos: ((videos as SupabaseProjectVideoRow[] | null) ?? []).map(
      toProjectVideo
    ),
  };
}
