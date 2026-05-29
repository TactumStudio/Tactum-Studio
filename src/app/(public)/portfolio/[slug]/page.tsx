import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Project, Photo, ProjectVideo } from "@/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { PhotoGallery } from "@/components/portfolio/PhotoGallery";
import { getLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

function localizedDescription(project: Project, locale: Locale): string | null {
  if (locale === "ca" && project.description_ca) return project.description_ca;
  if (locale === "en" && project.description_en) return project.description_en;
  return project.description;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("projects")
    .select("title, description")
    .eq("slug", slug)
    .single();

  if (!data) return {};
  return {
    description: data.description ?? undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [supabase, locale] = [createAdminClient(), await getLocale()];

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) notFound();

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("project_id", (project as Project).id)
    .order("display_order", { ascending: true });

  const { data: videos } = await supabase
    .from("project_videos")
    .select("*")
    .eq("project_id", (project as Project).id)
    .order("display_order", { ascending: true });

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors mb-12 group"
        >
          <svg
            className="w-3 h-3 transition-transform duration-300 group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          Portfolio
        </Link>

        {/* Header del proyecto */}
        <div className="mb-16 max-w-xl">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-600 mb-3">
            Proyecto
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-4">
            {(project as Project).title}
          </h1>
          {localizedDescription(project as Project, locale) && (
            <p className="text-neutral-500 text-sm leading-relaxed">
              {localizedDescription(project as Project, locale)}
            </p>
          )}
        </div>

        {/* Galeria (fotos + vídeos barrejats per display_order) */}
        <PhotoGallery
          photos={(photos as Photo[]) ?? []}
          videos={(videos as ProjectVideo[]) ?? []}
        />
      </div>
    </div>
  );
}
