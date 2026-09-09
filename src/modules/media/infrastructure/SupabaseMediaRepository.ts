import type { SupabaseClient } from "@supabase/supabase-js";
import type { MediaRepository } from "../application/MediaRepository";
import type { PhotoDraft, PhotoOrder } from "../domain/Photo";
import type { ProjectVideoDraft } from "../domain/ProjectVideo";

export class SupabaseMediaRepository implements MediaRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async savePhoto(photo: PhotoDraft): Promise<void> {
    const { error } = await this.supabase.from("photos").insert(photo);

    if (error) throw new Error(error.message);
  }

  async deletePhoto(id: string): Promise<void> {
    const { error } = await this.supabase.from("photos").delete().eq("id", id);

    if (error) throw new Error(error.message);
  }

  async updatePhotoOrder(photos: PhotoOrder[]): Promise<void> {
    const results = await Promise.all(
      photos.map(({ id, display_order }) =>
        this.supabase.from("photos").update({ display_order }).eq("id", id)
      )
    );

    const failed = results.find(({ error }) => error);
    if (failed?.error) throw new Error(failed.error.message);
  }

  async addProjectVideo(video: ProjectVideoDraft): Promise<void> {
    const { error } = await this.supabase.from("project_videos").insert(video);

    if (error) throw new Error(error.message);
  }

  async deleteProjectVideo(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("project_videos")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}
