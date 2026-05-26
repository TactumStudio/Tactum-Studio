import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { LOCALES, DEFAULT_LOCALE } from './translations';
import type { Locale } from './translations';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('locale')?.value;
  if (cookieLang && LOCALES.includes(cookieLang as Locale)) {
    return cookieLang as Locale;
  }

  const headersList = await headers();
  const acceptLang = headersList.get('accept-language') ?? '';

  if (/\bca\b/i.test(acceptLang)) return 'ca';
  if (/\ben\b/i.test(acceptLang)) return 'en';
  if (/\bes\b/i.test(acceptLang)) return 'es';
  return DEFAULT_LOCALE;
}

export { t, LOCALES, DEFAULT_LOCALE } from './translations';
export type { Locale } from './translations';
