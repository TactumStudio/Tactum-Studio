import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/types";

interface Props {
  settings: SiteSettings | null;
  locale: Locale;
}

export function ContactCTA({ settings, locale }: Props) {
  if (!settings?.contact_email && !settings?.contact_instagram) return null;

  const handle = settings?.contact_instagram
    ?.split("instagram.com/")[1]
    ?.split("?")[0]
    ?.split("#")[0]
    ?.replace(/\/$/, "");

  return (
    <section className="py-24 px-6 md:px-10 border-t border-neutral-100">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <p className="text-[9px] tracking-[0.5em] uppercase text-neutral-400 mb-8">
          {t('contactCta.label', locale)}
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          {settings?.contact_email && (
            <a
              href={`mailto:${settings.contact_email}`}
              className="group flex items-center gap-2 text-sm tracking-[0.1em] text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <svg
                className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {settings.contact_email}
            </a>
          )}

          {settings?.contact_instagram && (
            <a
              href={settings.contact_instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm tracking-[0.1em] text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <svg
                className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @{handle || 'instagram'}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
