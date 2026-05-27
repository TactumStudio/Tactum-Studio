"use client";

import { useState, useTransition } from "react";
import { updateProject } from "@/app/admin/projects/actions";
import { FeaturedToggle } from "./FeaturedToggle";
import { DeleteButton } from "./DeleteButton";
import { CoverImageUpload } from "./CoverImageUpload";
import type { Project } from "@/types";

export function ProjectTableRow({ project }: { project: Project }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateProject(project.id, formData);
        setEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error en desar");
      }
    });
  }

  return (
    <>
      <tr className="hover:bg-neutral-50 transition-colors">
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
            <FeaturedToggle id={project.id} isFeatured={project.is_featured} />
          </div>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setEditing((v) => !v)}
              className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors px-2 py-1 rounded"
            >
              {editing ? "Tancar" : "Editar"}
            </button>
            <DeleteButton id={project.id} />
          </div>
        </td>
      </tr>

      {editing && (
        <tr className="bg-neutral-50">
          <td colSpan={5} className="px-4 pb-4 pt-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg">
              {error && (
                <p className="text-red-500 text-xs">{error}</p>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-widest uppercase text-neutral-500">
                  Títol *
                </label>
                <input
                  name="title"
                  defaultValue={project.title}
                  required
                  className="bg-white border border-neutral-200 text-neutral-900 rounded-sm px-3 py-2 text-sm outline-none focus:border-neutral-400 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-widest uppercase text-neutral-500">
                  Descripció
                </label>
                <textarea
                  name="description"
                  defaultValue={project.description ?? ""}
                  rows={2}
                  className="bg-white border border-neutral-200 text-neutral-900 rounded-sm px-3 py-2 text-sm outline-none focus:border-neutral-400 transition-colors resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-neutral-900 text-white rounded-sm px-4 py-2 text-xs font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Desant..." : "Desar canvis"}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setError(null); }}
                  className="bg-transparent border border-neutral-200 text-neutral-500 rounded-sm px-4 py-2 text-xs hover:border-neutral-400 transition-colors"
                >
                  Cancel·lar
                </button>
              </div>
            </form>
          </td>
        </tr>
      )}
    </>
  );
}
