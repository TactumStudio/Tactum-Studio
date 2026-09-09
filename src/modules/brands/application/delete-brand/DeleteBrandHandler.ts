import type { BrandRepository } from "../BrandRepository";

export class DeleteBrandHandler {
  constructor(private readonly brands: BrandRepository) {}

  async execute(id: string): Promise<void> {
    await this.brands.delete(id);
  }
}
