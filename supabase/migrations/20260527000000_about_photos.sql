alter table public.site_settings
  add column if not exists about_photo_url  text,
  add column if not exists about_photo2_url text;
