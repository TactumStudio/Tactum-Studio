import type { PhotoDraft, PhotoOrder } from "../domain/Photo";
import type { ProjectVideoDraft } from "../domain/ProjectVideo";

export interface MediaRepository {
  savePhoto(photo: PhotoDraft): Promise<void>;
  deletePhoto(id: string): Promise<void>;
  updatePhotoOrder(photos: PhotoOrder[]): Promise<void>;
  addProjectVideo(video: ProjectVideoDraft): Promise<void>;
  deleteProjectVideo(id: string): Promise<void>;
}
