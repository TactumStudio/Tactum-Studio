import type { Metadata } from "next";
import type { Project } from "@/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { CreateProjectForm } from "@/components/admin/CreateProjectForm";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { CoverImageUpload } from "@/components/admin/CoverImageUpload";

export const metadata: Metadata = { title: "Projectes" };

export default async function AdminProjectsPage() {
  const supabase = createAdminClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Projectes</h1>

      {/* Formulari de creació */}
      <div className="mb-10 p-6 bg-neutral-50 rounded-sm border border-neutral-200">
        <h2 className="text-xs tracking-widest uppercase text-neutral-500 mb-5">
          Nou projecte
        </h2>
        <CreateProjectForm />
      </div>

      {/* Taula de projectes */}
      {!projects || projects.length === 0 ? (
        <div className="flex items-center justify-center h-40 border border-dashed border-neutral-200 rounded-sm">
          <p className="text-neutral-400 text-xs tracking-widest uppercase">
            Encara no hi ha projectes
          </p>
        </div>
      ) : (
        <div className="rounded-sm border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-neutral-500 font-normal w-12">
                  Portada
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-neutral-500 font-normal">
                  Títol
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-neutral-500 font-normal hidden md:table-cell">
                  Slug
                </th>
                <th className="text-center px-4 py-3 text-xs tracking-widest uppercase text-neutral-500 font-normal">
                  Destacat
                </th>
                <th className="px-4 py-3 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(projects as Project[]).map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <CoverImageUpload
                      projectId={project.id}
                      currentUrl={project.cover_image_url}
                    />
                  </td>
                  <td className="px-4 py-3 text-neutral-900 font-medium">
                    {project.title}
                  </td>
                  <td className="px-4 py-3 text-neutral-500 font-mono text-xs hidden md:table-cell">
                    {project.slug}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <FeaturedToggle
                        id={project.id}
                        isFeatured={project.is_featured}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton id={project.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
