"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { CreateBrandHandler } from "@/modules/brands/application/create-brand/CreateBrandHandler";
import { DeleteBrandHandler } from "@/modules/brands/application/delete-brand/DeleteBrandHandler";
import { SupabaseBrandRepository } from "@/modules/brands/infrastructure/SupabaseBrandRepository";

function brandRepository() {
  return new SupabaseBrandRepository(createAdminClient());
}

export async function createBrand(
  name: string | null,
  logoUrl: string | null,
  websiteUrl?: string
) {
  await new CreateBrandHandler(brandRepository()).execute({
    name,
    logoUrl,
    websiteUrl,
  });

  revalidatePath("/admin/brands");
  revalidatePath("/"); // carrusel en la Home
}

export async function deleteBrand(id: string) {
  await new DeleteBrandHandler(brandRepository()).execute(id);

  revalidatePath("/admin/brands");
  revalidatePath("/");
}
