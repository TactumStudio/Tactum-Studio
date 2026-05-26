-- Añade columnas faltantes a site_settings
-- Ejecutar en Supabase Dashboard > SQL Editor si ya tienes la tabla creada

alter table public.site_settings
  add column if not exists contact_phone    text,
  add column if not exists contact_location text,
  add column if not exists hero_text_color  text default '#ffffff',
  add column if not exists hero_title_size  text default 'md';
