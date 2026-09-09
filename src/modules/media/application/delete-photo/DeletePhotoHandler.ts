import type { MediaRepository } from "../MediaRepository";

export class DeletePhotoHandler {
  constructor(private readonly media: MediaRepository) {}

  async execute(id: string): Promise<void> {
    await this.media.deletePhoto(id);
  }
}
