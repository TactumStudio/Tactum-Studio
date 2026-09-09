import { ensureProjectTitle } from "../../domain/Project";
import type { ProjectRepository } from "../ProjectRepository";
import type { UpdateProjectCommand } from "./UpdateProjectCommand";

export class UpdateProjectHandler {
  constructor(private readonly projects: ProjectRepository) {}

  async execute(id: string, command: UpdateProjectCommand): Promise<void> {
    await this.projects.update(id, {
      title: ensureProjectTitle(command.title),
      description: normalizeOptionalText(command.description),
      description_ca: normalizeOptionalText(command.description_ca),
      description_en: normalizeOptionalText(command.description_en),
    });
  }
}

function normalizeOptionalText(value?: string | null): string | null {
  return value?.trim() || null;
}
