import type { ProjectRepository } from "../ProjectRepository";

export class ToggleFeaturedHandler {
  constructor(private readonly projects: ProjectRepository) {}

  async execute(id: string, isFeatured: boolean): Promise<void> {
    await this.projects.toggleFeatured(id, isFeatured);
  }
}
