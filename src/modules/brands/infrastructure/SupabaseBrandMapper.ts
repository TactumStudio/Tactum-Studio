import type { Brand } from "../domain/Brand";

export interface SupabaseBrandRow {
  id: string;
  name: string | null;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
}

export function toBrand(row: SupabaseBrandRow): Brand {
  return {
    id: row.id,
    name: row.name,
    logo_url: row.logo_url,
    website_url: row.website_url,
    display_order: row.display_order,
  };
}
