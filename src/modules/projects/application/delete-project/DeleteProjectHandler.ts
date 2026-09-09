import type { ProjectRepository } from "../ProjectRepository";

export class DeleteProjectHandler {
  constructor(private readonly projects: ProjectRepository) {}

  async execute(id: string): Promise<void> {
    await this.projects.delete(id);
  }
}
