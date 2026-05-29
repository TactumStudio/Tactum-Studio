import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types";
import type { Locale } from "@/lib/i18n";

function localizedDescription(project: Project, locale: Locale): string | null {
  if (locale === "ca" && project.description_ca) return project.description_ca;
  if (locale === "en" && project.description_en) return project.description_en;
  return project.description;
}

export function ProjectsGrid({ projects, locale }: { projects: Project[]; locale: Locale }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-neutral-200">
        <p className="text-neutral-600 text-xs tracking-widest uppercase">
          No hay proyectos todavía
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {projects.map((project, i) => {
        const description = localizedDescription(project, locale);
        return (
        <Link
          key={project.id}
          href={`/portfolio/${project.slug}`}
          className="group relative block overflow-hidden rounded-sm bg-neutral-900 break-inside-avoid"
        >
          {project.cover_image_url ? (
            <Image
              src={project.cover_image_url}
              alt={project.title}
              width={800}
              height={600}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={i < 2}
            />
          ) : (
            <div className="aspect-[4/3] flex items-center justify-center">
              <span className="text-neutral-700 text-xs tracking-widest uppercase">
                Sin imagen
              </span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="text-white text-sm font-medium">{project.title}</h3>
            {description && (
              <p className="text-neutral-300 text-xs mt-0.5 line-clamp-1">
                {description}
              </p>
            )}
          </div>
        </Link>
        );
      })}
    </div>
  );
}
