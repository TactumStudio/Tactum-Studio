import type { ProjectRepository } from "../ProjectRepository";

export class UpdateCoverImageHandler {
  constructor(private readonly projects: ProjectRepository) {}

  async execute(id: string, coverImageUrl: string): Promise<void> {
    await this.projects.updateCoverImage(id, coverImageUrl);
  }
}
