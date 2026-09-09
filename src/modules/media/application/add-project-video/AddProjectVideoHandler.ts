import { createProjectVideoDraft } from "../../domain/ProjectVideo";
import type { MediaRepository } from "../MediaRepository";
import type { AddProjectVideoCommand } from "./AddProjectVideoCommand";

export class AddProjectVideoHandler {
  constructor(private readonly media: MediaRepository) {}

  async execute(command: AddProjectVideoCommand): Promise<void> {
    await this.media.addProjectVideo(
      createProjectVideoDraft({
        project_id: command.projectId,
        url: command.url,
        title: command.title ?? null,
      })
    );
  }
}
