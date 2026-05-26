'use client';

import { cn } from '@/lib/utils';

interface Props {
  current: string;
}

export function LanguageSwitcher({ current }: Props) {
  function setLocale(locale: string) {
    document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-1">
      {(['es', 'ca', 'en'] as const).map((lang, i) => (
        <span key={lang} className="flex items-center">
          <button
            onClick={() => setLocale(lang)}
            className={cn(
              'text-[11px] tracking-widest uppercase transition-colors',
              'inline-flex items-center justify-center min-h-[44px] min-w-[44px]',
              current === lang
                ? 'text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            {lang}
          </button>
          {i < 2 && <span className="text-zinc-600 text-[11px]">·</span>}
        </span>
      ))}
    </div>
  );
}
