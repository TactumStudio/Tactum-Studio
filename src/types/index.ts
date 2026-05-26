export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Photo {
  id: string;
  project_id: string;
  url: string;         // URL pública en Cloudflare R2
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string | null;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
}

export interface SiteSettings {
  id: number;
  hero_image_url: string | null;
  hero_title: string | null;
  hero_title_ca: string | null;
  hero_title_en: string | null;
  hero_subtitle: string | null;
  hero_subtitle_ca: string | null;
  hero_subtitle_en: string | null;
  hero_text_color: string | null;
  hero_title_size: string | null;
  intro_text: string | null;
  intro_text_ca: string | null;
  intro_text_en: string | null;
  about_content: string | null;
  about_content_ca: string | null;
  about_content_en: string | null;
  contact_email: string | null;
  contact_instagram: string | null;
  contact_phone: string | null;
  contact_location: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  stripe_price_id: string;
  image_url: string | null;
  category: "tshirt" | "print";
  in_stock: boolean;
  created_at: string;
}
