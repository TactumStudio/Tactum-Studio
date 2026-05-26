import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale, t } from "@/lib/i18n";
import type { SiteSettings } from "@/types";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("about_content, about_content_ca, about_content_en")
    .eq("id", 1)
    .maybeSingle();

  const settings = data as Pick<SiteSettings, "about_content" | "about_content_ca" | "about_content_en"> | null;
  const locale = await getLocale();

  const aboutContent =
    locale === 'ca' ? (settings?.about_content_ca || settings?.about_content) :
    locale === 'en' ? (settings?.about_content_en || settings?.about_content) :
    settings?.about_content;

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 px-6 md:px-10">
      <div className="max-w-2xl mx-auto">
        <p className="text-[9px] tracking-[0.5em] uppercase text-neutral-400 mb-6">
          {t('about.label', locale)}
        </p>

        {aboutContent ? (
          <div className="space-y-6">
            {aboutContent.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-neutral-700 text-lg leading-relaxed font-light"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-neutral-400 italic text-lg font-light">
            {t('about.empty', locale)}
          </p>
        )}
      </div>
    </div>
  );
}
