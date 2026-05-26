alter table public.site_settings
  add column if not exists hero_title_ca    text,
  add column if not exists hero_title_en    text,
  add column if not exists hero_subtitle_ca text,
  add column if not exists hero_subtitle_en text,
  add column if not exists about_content_ca text,
  add column if not exists about_content_en text,
  add column if not exists intro_text_ca    text,
  add column if not exists intro_text_en    text;
