import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale, t } from "@/lib/i18n";
import type { SiteSettings } from "@/types";
import { ContactForm } from "@/components/contact/ContactForm";

export default async function ContactPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("contact_email, contact_instagram, contact_phone, contact_location")
    .eq("id", 1)
    .maybeSingle();

  const settings = data as Pick<
    SiteSettings,
    "contact_email" | "contact_instagram" | "contact_phone" | "contact_location"
  > | null;

  const locale = await getLocale();

  const instagramHandle = settings?.contact_instagram
    ?.split("instagram.com/")[1]
    ?.split("?")[0]
    ?.split("#")[0]
    ?.replace(/\/$/, "");

  const hasAnyContact =
    settings?.contact_email ||
    settings?.contact_instagram ||
    settings?.contact_phone;

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 px-6 md:px-10">
      <div className="max-w-2xl mx-auto">
        <p className="text-[9px] tracking-[0.5em] uppercase text-neutral-400 mb-6">
          {t('contact.label', locale)}
        </p>
        <h1 className="text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mb-16">
          {t('contact.heading', locale)}
        </h1>

        {hasAnyContact ? (
          <div className="flex flex-col gap-10 mb-16">
            {settings?.contact_email && (
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-neutral-400 mb-3">
                  {t('contact.email', locale)}
                </p>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-xl md:text-2xl text-neutral-700 hover:text-neutral-900 transition-colors border-b border-neutral-200 pb-1 inline-block"
                >
                  {settings.contact_email}
                </a>
              </div>
            )}

            {settings?.contact_phone && (
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-neutral-400 mb-3">
                  {t('contact.phone', locale)}
                </p>
                <a
                  href={`tel:${settings.contact_phone.replace(/\s/g, "")}`}
                  className="text-xl md:text-2xl text-neutral-700 hover:text-neutral-900 transition-colors border-b border-neutral-200 pb-1 inline-block"
                >
                  {settings.contact_phone}
                </a>
              </div>
            )}

            {settings?.contact_instagram && (
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-neutral-400 mb-3">
                  <svg
                    className="w-4 h-4 inline-block"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </p>
                <a
                  href={settings.contact_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl md:text-2xl text-neutral-700 hover:text-neutral-900 transition-colors inline-flex items-center gap-2"
                >
                  @{instagramHandle || "instagram"}
                </a>
              </div>
            )}
          </div>
        ) : (
          <p className="text-neutral-400 italic text-lg font-light mb-16">
            {t('contact.empty', locale)}
          </p>
        )}

        <div className="border-t border-neutral-100 mb-14" />

        <div className="mb-16 border border-neutral-200 rounded-sm p-8 md:p-12">
          <p className="text-[9px] tracking-[0.5em] uppercase text-neutral-400 mb-10">
            {t("contact.form.title", locale)}
          </p>
          <ContactForm locale={locale} />
        </div>

        {settings?.contact_location && (
          <>
            <div className="border-t border-neutral-100 mb-10" />
            <div>
              <p className="text-[9px] tracking-[0.4em] uppercase text-neutral-400 mb-6">
                {t('contact.location', locale)}
              </p>
              <p className="text-sm text-neutral-500 mb-6">
                {settings.contact_location}
              </p>
              <div className="w-full overflow-hidden rounded-sm" style={{ height: "400px" }}>
                <iframe
                  title={t('contact.mapTitle', locale)}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.contact_location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(1) contrast(0.9)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
