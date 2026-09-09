export interface SavePhotoCommand {
  projectId: string;
  url: string;
  altText?: string | null;
}
