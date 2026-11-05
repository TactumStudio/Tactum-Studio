import type { PhotoOrder } from "../../domain/Photo";
import type { MediaRepository } from "../MediaRepository";

export class UpdatePhotoOrderHandler {
  constructor(private readonly media: MediaRepository) {}

  async execute(photos: PhotoOrder[]): Promise<void> {
    await this.media.updatePhotoOrder(photos);
  }
}
