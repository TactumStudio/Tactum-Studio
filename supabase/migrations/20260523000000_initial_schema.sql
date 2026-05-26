-- ============================================================
-- PORTFOLIO FOTÓGRAFO — Schema inicial
-- Storage: Cloudflare R2 (las URLs apuntan a R2, no a Supabase Storage)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ─── EXTENSIONES ────────────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ─── TABLAS ─────────────────────────────────────────────────

-- Proyectos del portfolio
create table public.projects (
  id              uuid        primary key default uuid_generate_v4(),
  title           text        not null,
  slug            text        not null unique,
  description     text,
  cover_image_url text,                                 -- URL pública en R2
  is_featured     boolean     not null default false,
  display_order   integer     not null default 0,
  created_at      timestamptz not null default now()
);

-- Fotos dentro de cada proyecto (URLs apuntan a Cloudflare R2)
create table public.photos (
  id            uuid        primary key default uuid_generate_v4(),
  project_id    uuid        not null references public.projects(id) on delete cascade,
  url           text        not null,   -- URL pública en R2
  alt_text      text,
  display_order integer     not null default 0,
  created_at    timestamptz not null default now()
);

-- Marcas / logos del carrusel
create table public.brands (
  id            uuid    primary key default uuid_generate_v4(),
  name          text,
  logo_url      text,              -- URL pública en R2 (opcional)
  website_url   text,
  display_order integer not null default 0
);

-- Productos de la tienda
create table public.products (
  id              uuid        primary key default uuid_generate_v4(),
  name            text        not null,
  slug            text        not null unique,
  description     text,
  price_cents     integer     not null,
  stripe_price_id text        not null,
  image_url       text,                    -- URL pública en R2
  category        text        not null check (category in ('tshirt', 'print')),
  in_stock        boolean     not null default true,
  created_at      timestamptz not null default now()
);


-- Configuración del sitio (fila única, id=1 siempre)
create table public.site_settings (
  id                integer     primary key default 1,
  hero_image_url    text,
  hero_title        text,
  hero_subtitle     text,
  about_content     text,
  contact_email     text,
  intro_text        text,
  contact_instagram text,
  contact_phone     text,
  contact_location  text,
  hero_text_color   text default '#ffffff',
  hero_title_size   text default 'md',
  constraint single_row check (id = 1)
);

-- Fila por defecto
insert into public.site_settings (id) values (1) on conflict (id) do nothing;


-- ─── ÍNDICES ────────────────────────────────────────────────
create index on public.projects (is_featured) where is_featured = true;
create index on public.projects (display_order);
create index on public.photos   (project_id);
create index on public.photos   (display_order);
create index on public.brands   (display_order);
create index on public.products (category);
create index on public.products (in_stock) where in_stock = true;


-- ─── ROW LEVEL SECURITY ─────────────────────────────────────

alter table public.projects enable row level security;
alter table public.photos   enable row level security;
alter table public.brands   enable row level security;
alter table public.products enable row level security;

alter table public.site_settings enable row level security;

-- ✅ LECTURA PÚBLICA — cualquier visitante puede leer
create policy "projects: lectura pública"
  on public.projects for select using (true);

create policy "photos: lectura pública"
  on public.photos for select using (true);

create policy "brands: lectura pública"
  on public.brands for select using (true);

create policy "products: lectura pública"
  on public.products for select using (true);

create policy "settings: lectura pública"
  on public.site_settings for select using (true);

-- 🔒 ESCRITURA PRIVADA — solo usuario autenticado (admin)
create policy "projects: solo admin puede insertar"
  on public.projects for insert
  with check ((select auth.role()) = 'authenticated');

create policy "projects: solo admin puede actualizar"
  on public.projects for update
  using ((select auth.role()) = 'authenticated');

create policy "projects: solo admin puede borrar"
  on public.projects for delete
  using ((select auth.role()) = 'authenticated');

create policy "photos: solo admin puede insertar"
  on public.photos for insert
  with check ((select auth.role()) = 'authenticated');

create policy "photos: solo admin puede actualizar"
  on public.photos for update
  using ((select auth.role()) = 'authenticated');

create policy "photos: solo admin puede borrar"
  on public.photos for delete
  using ((select auth.role()) = 'authenticated');

create policy "brands: solo admin puede insertar"
  on public.brands for insert
  with check ((select auth.role()) = 'authenticated');

create policy "brands: solo admin puede actualizar"
  on public.brands for update
  using ((select auth.role()) = 'authenticated');

create policy "brands: solo admin puede borrar"
  on public.brands for delete
  using ((select auth.role()) = 'authenticated');

create policy "products: solo admin puede insertar"
  on public.products for insert
  with check ((select auth.role()) = 'authenticated');

create policy "products: solo admin puede actualizar"
  on public.products for update
  using ((select auth.role()) = 'authenticated');

create policy "products: solo admin puede borrar"
  on public.products for delete
  using ((select auth.role()) = 'authenticated');

create policy "settings: solo admin puede actualizar"
  on public.site_settings for update
  using ((select auth.role()) = 'authenticated');
