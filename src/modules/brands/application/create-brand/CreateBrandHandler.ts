import { createBrandDraft } from "../../domain/Brand";
import type { BrandRepository } from "../BrandRepository";
import type { CreateBrandCommand } from "./CreateBrandCommand";

export class CreateBrandHandler {
  constructor(private readonly brands: BrandRepository) {}

  async execute(command: CreateBrandCommand): Promise<void> {
    await this.brands.create(
      createBrandDraft({
        name: command.name ?? null,
        logo_url: command.logoUrl ?? null,
        website_url: command.websiteUrl ?? null,
      })
    );
  }
}
