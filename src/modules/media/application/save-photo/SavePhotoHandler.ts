import { createPhotoDraft } from "../../domain/Photo";
import type { MediaRepository } from "../MediaRepository";
import type { SavePhotoCommand } from "./SavePhotoCommand";

export class SavePhotoHandler {
  constructor(private readonly media: MediaRepository) {}

  async execute(command: SavePhotoCommand): Promise<void> {
    await this.media.savePhoto(
      createPhotoDraft({
        project_id: command.projectId,
        url: command.url,
        alt_text: command.altText ?? null,
      })
    );
  }
}
