import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale, t } from "@/lib/i18n";
import type { SiteSettings } from "@/types";

export default async function AboutPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("about_content, about_content_ca, about_content_en, about_photo_url, about_photo2_url")
    .eq("id", 1)
    .maybeSingle();

  const settings = data as Pick<
    SiteSettings,
    "about_content" | "about_content_ca" | "about_content_en" | "about_photo_url" | "about_photo2_url"
  > | null;
  const locale = await getLocale();

  const aboutContent =
    locale === "ca" ? (settings?.about_content_ca || settings?.about_content) :
    locale === "en" ? (settings?.about_content_en || settings?.about_content) :
    settings?.about_content;

  const photo1 = settings?.about_photo_url ?? null;
  const photo2 = settings?.about_photo2_url ?? null;

  const paragraphs = aboutContent?.split("\n\n").filter(Boolean) ?? [];
  const firstParagraph = paragraphs[0] ?? null;
  const restParagraphs = paragraphs.slice(1);

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <p className="text-[9px] tracking-[0.5em] uppercase text-neutral-400 mb-10">
          {t("about.label", locale)}
        </p>

        {/* First paragraph beside the photo — strict flex, text never overflows below */}
        <div className={`flex flex-col ${photo1 ? "md:flex-row md:gap-12" : ""} gap-8 mb-16`}>
          {photo1 && (
            <div className="shrink-0 md:w-64 lg:w-80">
              <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden bg-neutral-100">
                <Image
                  src={photo1}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
            </div>
          )}
          <div className="flex-1">
            {firstParagraph ? (
              <p className="text-neutral-700 text-lg leading-relaxed font-light">
                {firstParagraph}
              </p>
            ) : (
              <p className="text-neutral-400 italic text-lg font-light">
                {t("about.empty", locale)}
              </p>
            )}
          </div>
        </div>

        {/* Rest of paragraphs full-width — only rendered if there are 2+ paragraphs */}
        {restParagraphs.length > 0 && (
          <div className="mb-16 space-y-6">
            {restParagraphs.map((paragraph, i) => (
              <p key={i} className="text-neutral-700 text-lg leading-relaxed font-light">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Bottom large photo */}
        {photo2 && (
          <div className="relative w-full aspect-[16/9] rounded-sm overflow-hidden bg-neutral-100">
            <Image
              src={photo2}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
      </div>
    </div>
  );
}
