import type { Project, ProjectDraft } from "../domain/Project";
import type { UpdateProjectCommand } from "./update-project/UpdateProjectCommand";

export interface ProjectRepository {
  create(project: ProjectDraft): Promise<void>;
  update(id: string, project: UpdateProjectCommand): Promise<void>;
  updateCoverImage(id: string, coverImageUrl: string): Promise<void>;
  toggleFeatured(id: string, isFeatured: boolean): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ProjectReadRepository {
  listForAdmin(): Promise<Project[]>;
  findMetadataBySlug(slug: string): Promise<Pick<Project, "title" | "description"> | null>;
  findBySlug(slug: string): Promise<Project | null>;
}
