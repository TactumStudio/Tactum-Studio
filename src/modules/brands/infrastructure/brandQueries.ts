import { createAdminClient } from "@/lib/supabase/admin";
import type { Brand } from "../domain/Brand";
import { toBrand, type SupabaseBrandRow } from "./SupabaseBrandMapper";

export async function listBrands(): Promise<Brand[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("brands")
    .select("*")
    .order("display_order", { ascending: true });

  return ((data as SupabaseBrandRow[] | null) ?? []).map(toBrand);
}
