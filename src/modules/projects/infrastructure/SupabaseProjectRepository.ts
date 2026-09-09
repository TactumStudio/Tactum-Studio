import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProjectDraft } from "../domain/Project";
import type { ProjectRepository } from "../application/ProjectRepository";
import type { UpdateProjectCommand } from "../application/update-project/UpdateProjectCommand";

export class SupabaseProjectRepository implements ProjectRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async create(project: ProjectDraft): Promise<void> {
    const { error } = await this.supabase.from("projects").insert(project);

    if (error) {
      if (error.code === "23505") {
        throw new Error(`El slug "${project.slug}" ya existe`);
      }

      throw new Error(error.message);
    }
  }

  async update(id: string, project: UpdateProjectCommand): Promise<void> {
    const { error } = await this.supabase
      .from("projects")
      .update(project)
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async updateCoverImage(id: string, coverImageUrl: string): Promise<void> {
    const { error } = await this.supabase
      .from("projects")
      .update({ cover_image_url: coverImageUrl })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async toggleFeatured(id: string, isFeatured: boolean): Promise<void> {
    const { error } = await this.supabase
      .from("projects")
      .update({ is_featured: isFeatured })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("projects").delete().eq("id", id);

    if (error) throw new Error(error.message);
  }
}
