export interface Brand {
  id: string;
  name: string | null;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
}

export interface BrandDraft {
  name: string | null;
  logo_url: string | null;
  website_url: string | null;
}

export function createBrandDraft(input: BrandDraft): BrandDraft {
  return {
    name: normalizeOptionalText(input.name),
    logo_url: normalizeOptionalText(input.logo_url),
    website_url: normalizeOptionalText(input.website_url),
  };
}

function normalizeOptionalText(value?: string | null): string | null {
  return value?.trim() || null;
}
