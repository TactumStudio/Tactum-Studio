import { createProjectDraft } from "../../domain/Project";
import { buildProjectSlug } from "../../domain/value-objects/ProjectSlug";
import type { ProjectRepository } from "../ProjectRepository";
import type { CreateProjectCommand } from "./CreateProjectCommand";

export class CreateProjectHandler {
  constructor(private readonly projects: ProjectRepository) {}

  async execute(command: CreateProjectCommand): Promise<void> {
    const project = createProjectDraft({
      title: command.title,
      slug: buildProjectSlug(command.title, command.slug),
      description: normalizeOptionalText(command.description),
      description_ca: normalizeOptionalText(command.description_ca),
      description_en: normalizeOptionalText(command.description_en),
      cover_image_url: normalizeOptionalText(command.cover_image_url),
      is_featured: command.is_featured,
    });

    await this.projects.create(project);
  }
}

function normalizeOptionalText(value?: string | null): string | null {
  return value?.trim() || null;
}
