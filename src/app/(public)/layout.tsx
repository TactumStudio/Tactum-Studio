import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale, t } from "@/lib/i18n";
import { MobileHeader } from "@/components/MobileHeader";
import Link from "next/link";
import type { SiteSettings } from "@/types";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("contact_instagram, contact_email")
    .eq("id", 1)
    .maybeSingle();

  const settings = data as Pick<SiteSettings, "contact_instagram" | "contact_email"> | null;
  const locale = await getLocale();

  return (
    <>
      <MobileHeader
        navItems={[
          { href: "/portfolio", label: t("nav.portfolio", locale) },
          { href: "/about",     label: t("nav.about", locale) },
          { href: "/contact",   label: t("nav.contact", locale) },
          { href: "/shop",      label: t("nav.shop", locale) },
        ]}
        instagramUrl={settings?.contact_instagram ?? undefined}
        locale={locale}
      />

      <main className="flex-1">{children}</main>

      <footer className="bg-zinc-800 border-t border-white/5 py-8 px-6 md:px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-[10px] tracking-[0.35em] text-zinc-300 hover:text-white transition-colors"
          >
            Tactum Studio
          </Link>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] tracking-widest uppercase text-zinc-600">
              {t("footer.rights", locale, { year: String(new Date().getFullYear()) })}
            </p>
            {settings?.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {settings.contact_email}
              </a>
            )}
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/portfolio"
              className="text-[10px] tracking-widest uppercase text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {t("nav.portfolio", locale)}
            </Link>
            <Link
              href="/shop"
              className="text-[10px] tracking-widest uppercase text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {t("nav.shop", locale)}
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
