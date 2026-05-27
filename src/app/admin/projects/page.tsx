import type { Metadata } from "next";
import type { Project } from "@/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { CreateProjectForm } from "@/components/admin/CreateProjectForm";
import { ProjectTableRow } from "@/components/admin/ProjectTableRow";

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
                <ProjectTableRow key={project.id} project={project} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
