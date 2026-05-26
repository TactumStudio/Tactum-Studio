import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/types";

interface Props {
  settings: SiteSettings | null;
  locale: Locale;
}

function pickLocale(base: string | null | undefined, ca: string | null | undefined, en: string | null | undefined, locale: Locale): string | null {
  if (locale === 'ca') return ca || base || null;
  if (locale === 'en') return en || base || null;
  return base || null;
}

export function Hero({ settings, locale }: Props) {
  const title = pickLocale(settings?.hero_title, settings?.hero_title_ca, settings?.hero_title_en, locale);
  const subtitle = pickLocale(settings?.hero_subtitle, settings?.hero_subtitle_ca, settings?.hero_subtitle_en, locale);
  const imageUrl = settings?.hero_image_url ?? null;
  // Sin imagen: sección compacta sobre fondo blanco
  if (!imageUrl) {
    if (!title && !subtitle) return null;

    return (
      <section className="pt-28 pb-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          {title && (
            <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase leading-none tracking-tight text-neutral-900 mb-4">
              {title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
          )}
          {subtitle && (
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mt-4">
              {subtitle}
            </p>
          )}
        </div>
      </section>
    );
  }

  // Con imagen: hero pantalla completa
  const textColor = settings?.hero_text_color ?? "#ffffff";
  const sizeKey = settings?.hero_title_size ?? "md";
  const fontSizeMap: Record<string, string> = {
    xs: "clamp(1.2rem, 3vw, 2rem)",
    sm: "clamp(1.6rem, 4vw, 3rem)",
    md: "clamp(2rem, 5vw, 4rem)",
    lg: "clamp(2.5rem, 6vw, 5.5rem)",
    xl: "clamp(3rem, 8vw, 7rem)",
  };
  const fontSize = fontSizeMap[sizeKey] ?? fontSizeMap.md;

  return (
    <section className="relative min-h-screen overflow-hidden bg-neutral-900">
      <Image
        src={imageUrl}
        alt="Hero"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {(title || subtitle) && (
        <div className="absolute inset-0 z-10 flex flex-col justify-end md:justify-center items-center md:items-end pb-[25%] px-6 md:pb-0 md:px-0 md:pr-16 lg:pr-24">
          <div className="max-w-xl text-center md:text-right">
            {title && (
              <h1
                className="font-black uppercase leading-[0.9] tracking-tight mb-4"
                style={{ color: textColor, fontSize }}
              >
                {title.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            )}
            {subtitle && (
              <p
                className="text-sm md:text-base leading-relaxed max-w-sm mx-auto md:mx-0 md:ml-auto"
                style={{ color: textColor }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
