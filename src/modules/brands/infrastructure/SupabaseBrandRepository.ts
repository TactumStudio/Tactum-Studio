import type { SupabaseClient } from "@supabase/supabase-js";
import type { BrandDraft } from "../domain/Brand";
import type { BrandRepository } from "../application/BrandRepository";

export class SupabaseBrandRepository implements BrandRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async create(brand: BrandDraft): Promise<void> {
    const { error } = await this.supabase.from("brands").insert(brand);

    if (error) throw new Error(error.message);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("brands").delete().eq("id", id);

    if (error) throw new Error(error.message);
  }
}
