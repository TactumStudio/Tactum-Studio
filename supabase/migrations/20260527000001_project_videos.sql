create table if not exists public.project_videos (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  url           text not null,
  title         text,
  display_order int  not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.project_videos enable row level security;

create policy "Public can read project_videos"
  on public.project_videos for select using (true);

create policy "Authenticated can manage project_videos"
  on public.project_videos for all using (auth.role() = 'authenticated');
