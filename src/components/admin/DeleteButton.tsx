"use client";

import { useTransition } from "react";
import { deleteProject } from "@/app/admin/projects/actions";

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (
      !confirm(
        "Esborrar aquest projecte? S'eliminaran tots els registres de fotos de la base de dades."
      )
    )
      return;

    startTransition(() => deleteProject(id));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-neutral-600 hover:text-red-400 transition-colors disabled:opacity-40"
    >
      {isPending ? "..." : "Esborrar"}
    </button>
  );
}
