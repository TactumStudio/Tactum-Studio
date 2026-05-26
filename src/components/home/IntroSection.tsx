import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { Brand, SiteSettings } from "@/types";

interface Props {
  settings: SiteSettings | null;
  brands: Brand[] | null;
  locale: Locale;
}

export function IntroSection({ settings, brands, locale }: Props) {
  const introText =
    locale === 'ca' ? (settings?.intro_text_ca || settings?.intro_text) :
    locale === 'en' ? (settings?.intro_text_en || settings?.intro_text) :
    settings?.intro_text;
  const hasText = !!introText;
  const hasBrands = !!brands && brands.length > 0;

  if (!hasText && !hasBrands) return null;

  return (
    <section className="py-20 px-6 md:px-10 border-t border-neutral-100">
      <div className="max-w-6xl mx-auto">
        {hasText && hasBrands ? (
          /* Texto izquierda + marcas derecha (como Liqen Studio) */
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            <div className="md:w-[360px] shrink-0">
              {introText!.split("\n\n").map((p, i) => (
                <p
                  key={i}
                  className="text-neutral-600 text-sm leading-relaxed mb-4 last:mb-0"
                >
                  {p}
                </p>
              ))}
            </div>
            <div className="flex-1 border-t md:border-t-0 md:border-l border-neutral-200 pt-10 md:pt-0 md:pl-16">
              <BrandGrid brands={brands} />
            </div>
          </div>
        ) : hasBrands ? (
          /* Solo marcas — grid centrado */
          <BrandGrid brands={brands} centered />
        ) : (
          /* Solo texto */
          <div className="max-w-xl">
            {introText!.split("\n\n").map((p, i) => (
              <p
                key={i}
                className="text-neutral-600 text-sm leading-relaxed mb-4 last:mb-0"
              >
                {p}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BrandGrid({
  brands,
  centered = false,
}: {
  brands: Brand[];
  centered?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-12 gap-y-8 ${
        centered ? "justify-center" : ""
      }`}
    >
      {brands.map((brand) => (
        <BrandLogo key={brand.id} brand={brand} />
      ))}
    </div>
  );
}

function BrandLogo({ brand }: { brand: Brand }) {
  const inner = (
    <div className="flex flex-col items-center gap-2 opacity-50 hover:opacity-90 transition-opacity duration-300">
      {brand.logo_url ? (
        <div className="relative h-8 w-24">
          <Image
            src={brand.logo_url}
            alt={brand.name ?? ""}
            fill
            className="object-contain"
            sizes="96px"
          />
        </div>
      ) : (
        <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 text-center">
          {brand.name}
        </span>
      )}
    </div>
  );

  if (brand.website_url) {
    return (
      <a href={brand.website_url} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return <div>{inner}</div>;
}
