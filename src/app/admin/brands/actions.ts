"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createBrand(
  name: string | null,
  logoUrl: string | null,
  websiteUrl?: string
) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("brands").insert({
    name: name || null,
    logo_url: logoUrl || null,
    website_url: websiteUrl ?? null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/brands");
  revalidatePath("/"); // carrusel en la Home
}

export async function deleteBrand(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("brands").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/brands");
  revalidatePath("/");
}
