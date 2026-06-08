import Image from "next/image";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { t } from "@/lib/i18n";
import type { Project } from "@/types";
import type { Locale } from "@/lib/i18n";

function localizedDescription(project: Project, locale: Locale): string | null {
  if (locale === "ca" && project.description_ca) return project.description_ca;
  if (locale === "en" && project.description_en) return project.description_en;
  return project.description;
}

interface Props {
  locale: Locale;
}

export async function FeaturedProjects({ locale }: Props) {
  const supabase = createAdminClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, slug, cover_image_url, description")
    .eq("is_featured", true)
    .order("display_order", { ascending: true });

  if (!projects || projects.length === 0) return null;

  const items = projects as Project[];

  return (
    <section className="px-1 md:px-2 pb-16 md:pb-24">
      {items.length >= 3 ? (
        <div className="flex flex-col md:flex-row gap-1 md:h-[87vh]">
          <ProjectCard
            project={items[0]}
            locale={locale}
            className="flex-[2] min-h-[65vw] md:min-h-0 md:h-full"
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
          />
          <div className="flex-1 flex flex-col gap-1">
            {items.slice(1, 3).map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                locale={locale}
                className="flex-1 min-h-[32vw] md:min-h-0 md:h-auto"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ))}
          </div>
        </div>
      ) : items.length === 2 ? (
        <div className="flex flex-col md:flex-row gap-1 md:h-[78vh]">
          <ProjectCard
            project={items[0]}
            locale={locale}
            className="flex-1 min-h-[60vw] md:min-h-0 md:h-full"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <ProjectCard
            project={items[1]}
            locale={locale}
            className="flex-1 min-h-[60vw] md:min-h-0 md:h-full"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : (
        <div className="h-[72vh]">
          <ProjectCard
            project={items[0]}
            locale={locale}
            className="h-full w-full"
            sizes="100vw"
            priority
          />
        </div>
      )}

      <div className="flex justify-end mt-4 px-4 md:px-6">
        <Link
          href="/portfolio"
          className="group text-[10px] tracking-[0.3em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors flex items-center gap-2"
        >
          {t('portfolio.viewAll', locale)}
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  locale,
  className = "",
  sizes,
  priority = false,
}: {
  project: Project;
  locale: Locale;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const description = localizedDescription(project, locale);

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={`group relative overflow-hidden bg-neutral-100 block ${className}`}
    >
      {project.cover_image_url ? (
        <Image
          src={project.cover_image_url}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={sizes}
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
          <span className="text-neutral-300 text-xs tracking-widest uppercase">
            Sin imagen
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="text-white font-light text-base md:text-lg tracking-wide">
          {project.title}
        </h3>
        {description && (
          <p className="text-white/70 text-xs mt-1 line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
