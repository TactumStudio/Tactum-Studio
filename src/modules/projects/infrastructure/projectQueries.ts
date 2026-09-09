import type { Photo, ProjectVideo } from "@/types";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Project } from "../domain/Project";
import { toProject, type SupabaseProjectRow } from "./SupabaseProjectMapper";

export async function listAdminProjects(): Promise<Project[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  return ((data as SupabaseProjectRow[] | null) ?? []).map(toProject);
}

export async function getProjectMetadata(
  slug: string
): Promise<Pick<Project, "title" | "description"> | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("projects")
    .select("title, description")
    .eq("slug", slug)
    .single();

  return data as Pick<Project, "title" | "description"> | null;
}

export async function getProjectDetailBySlug(slug: string): Promise<{
  project: Project | null;
  photos: Photo[];
  videos: ProjectVideo[];
}> {
  const supabase = createAdminClient();

  const { data: projectData } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!projectData) {
    return { project: null, photos: [], videos: [] };
  }

  const project = toProject(projectData as SupabaseProjectRow);

  const [{ data: photos }, { data: videos }] = await Promise.all([
    supabase
      .from("photos")
      .select("*")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("project_videos")
      .select("*")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
  ]);

  return {
    project,
    photos: (photos as Photo[] | null) ?? [],
    videos: (videos as ProjectVideo[] | null) ?? [],
  };
}
