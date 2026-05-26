import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale } from "@/lib/i18n";
import { Hero } from "@/components/home/Hero";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { IntroSection } from "@/components/home/IntroSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import type { Brand, SiteSettings } from "@/types";

export default async function HomePage() {
  const supabase = createAdminClient();
  const locale = await getLocale();

  const [{ data: settingsData }, { data: brandsData }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase
      .from("brands")
      .select("*")
      .order("display_order", { ascending: true }),
  ]);

  const settings = settingsData as SiteSettings | null;
  const brands = brandsData as Brand[] | null;

  return (
    <div className="bg-white">
      <Hero settings={settings} locale={locale} />
      <div className="border-t border-b border-neutral-200" />

      {/* Proyectos destacados — si no hay, IntroSection sube a ocupar el espacio */}
      <FeaturedProjects locale={locale} />

      {/* Texto intro + grid estático de marcas */}
      <IntroSection settings={settings} brands={brands} locale={locale} />

      <ContactCTA settings={settings} locale={locale} />
    </div>
  );
}
