import type { BrandDraft } from "../domain/Brand";

export interface BrandRepository {
  create(brand: BrandDraft): Promise<void>;
  delete(id: string): Promise<void>;
}
