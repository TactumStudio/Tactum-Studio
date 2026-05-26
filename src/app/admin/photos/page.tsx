import Image from "next/image";
import type { Metadata } from "next";
import type { Project, Photo } from "@/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { DeletePhotoButton } from "@/components/admin/DeletePhotoButton";

export const metadata: Metadata = { title: "Fotos" };

interface Props {
  searchParams: Promise<{ project?: string }>;
}

export default async function AdminPhotosPage({ searchParams }: Props) {
  const { project: selectedSlug } = await searchParams;
  const supabase = createAdminClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, slug")
    .order("display_order", { ascending: true });

  const selectedProject = (projects as Project[] | null)?.find(
    (p) => p.slug === selectedSlug
  );

  const { data: photos } = selectedProject
    ? await supabase
        .from("photos")
        .select("*")
        .eq("project_id", selectedProject.id)
        .order("display_order", { ascending: true })
    : { data: null };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Fotos</h1>

      {/* Selector de projecte */}
      <div className="mb-8 p-6 bg-neutral-50 rounded-sm border border-neutral-200">
        <h2 className="text-xs tracking-widest uppercase text-neutral-500 mb-4">
          Projecte
        </h2>

        {!projects || projects.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Crea primer un projecte a{" "}
            <a
              href="/admin/projects"
              className="underline hover:text-neutral-900 transition-colors"
            >
              Projectes
            </a>
            .
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(projects as Project[]).map((project) => (
              <a
                key={project.id}
                href={`/admin/photos?project=${project.slug}`}
                className={`px-3 py-1.5 rounded-sm text-xs transition-colors border ${
                  selectedProject?.id === project.id
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-transparent text-neutral-500 border-neutral-200 hover:border-neutral-500 hover:text-neutral-900"
                }`}
              >
                {project.title}
              </a>
            ))}
          </div>
        )}
      </div>

      {selectedProject ? (
        <>
          {/* Uploader */}
          <div className="mb-8 p-6 bg-neutral-50 rounded-sm border border-neutral-200">
            <h2 className="text-xs tracking-widest uppercase text-neutral-500 mb-5">
              Afegir fotos — {selectedProject.title}
            </h2>
            <PhotoUploader projectId={selectedProject.id} />
          </div>

          {/* Fotos existents */}
          <div>
            <h2 className="text-xs tracking-widest uppercase text-neutral-500 mb-4">
              Fotos del projecte
            </h2>

            {!photos || photos.length === 0 ? (
              <div className="flex items-center justify-center h-32 border border-dashed border-neutral-200 rounded-sm">
                <p className="text-neutral-400 text-xs tracking-widest uppercase">
                  Encara no hi ha fotos
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {(photos as Photo[]).map((photo) => (
                  <div key={photo.id} className="relative group aspect-square">
                    <Image
                      src={photo.url}
                      alt={photo.alt_text ?? ""}
                      fill
                      className="object-cover rounded-sm"
                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                    />
                    <DeletePhotoButton
                      id={photo.id}
                      projectSlug={selectedProject.slug}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-40 border border-dashed border-neutral-200 rounded-sm">
          <p className="text-neutral-400 text-xs tracking-widest uppercase">
            Selecciona un projecte per veure i pujar fotos
          </p>
        </div>
      )}
    </div>
  );
}
