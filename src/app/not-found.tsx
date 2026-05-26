import Link from "next/link";
import { getLocale, t } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-neutral-600 text-xs tracking-widest uppercase mb-4">
          404
        </p>
        <h1 className="text-neutral-900 text-3xl font-semibold mb-6">
          {t('404.title', locale)}
        </h1>
        <Link
          href="/"
          className="text-xs tracking-widest uppercase text-neutral-900 border border-neutral-300 px-6 py-3 hover:bg-neutral-900 hover:text-white transition-colors"
        >
          {t('404.back', locale)}
        </Link>
      </div>
    </div>
  );
}
