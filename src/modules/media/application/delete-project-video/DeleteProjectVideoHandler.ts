import type { MediaRepository } from "../MediaRepository";

export class DeleteProjectVideoHandler {
  constructor(private readonly media: MediaRepository) {}

  async execute(id: string): Promise<void> {
    await this.media.deleteProjectVideo(id);
  }
}
